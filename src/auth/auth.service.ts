import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { v4 as uuidv4 } from 'uuid';
import { DateTime } from "luxon";
import { AccountService } from 'src/account/account.service';
import { UserService } from 'src/user/user.service';
import { EmailService } from 'src/email/email.service';
import { SessionService } from 'src/session/session.service';

@Injectable()
export class AuthService {

    constructor(
        private accountService: AccountService,
        private sessionService: SessionService,
        private emailService: EmailService,
        private userService: UserService,
        private jwtService: JwtService
    ) { }

    async validateUser(username: string, password: string): Promise<any> {
        const account = await this.accountService.findByUserName(username);

        if (account && await this.accountService.compareHash(password, account.password)) {
            return account;
        }
    }

    async login(account: any) {
        const payload = { name: account.username, sub: account.pk };

        const expiration = account.remember ? Number.parseInt(process.env.EXPIRES) : 28800; // 14 days or 8 hrs

        account.access_token = this.jwtService.sign(payload, { expiresIn: expiration + 's' });

        account.expiration = DateTime.now().plus({ seconds: expiration }).toFormat('y-LL-dd HH:mm:ss');

        this.sessionService.create(account);

        // let user = await this.accountService.findOne(account.pk);
        // if (user.user.role_pk != account.role_pk) {
        //     return {};
        // }

        const { pk, password, verified, active, date_created, archived, password_reset, ...others } = account;
        return others;
    }

    async logout(user: any) {
        return await this.sessionService.removeByAccount(user.pk);
    }

    async forgotPassword(data: any) {
        const user = await this.userService.findByEmail(data.email);
        // console.log(user);
        if (user) {
            let uuid = uuidv4();

            if (data.device == 'mobile') {
                let randomNumbers = [];
                for (let i = 0; i < 4; i++) {
                    const num = Math.floor(Math.random() * 10);
                    randomNumbers.push(num);
                }

                uuid = randomNumbers.join('');
            }
            // console.log('uuid', uuid);
            const fields = data.device == 'mobile' ? { password_reset: { token: uuid, expiration: DateTime.now().plus({ hours: 1 }) } } : { password_reset: { token: uuid, expiration: DateTime.now().plus({ hours: 1 }) } };
            const updated = await this.accountService.update(user.account_pk, fields);

            if (updated) {
                this.emailService.account_pk = user.account_pk;
                this.emailService.user_pk = user.pk;
                this.emailService.from = process.env.SEND_FROM;
                this.emailService.from_name = process.env.SENDER;
                this.emailService.to = data.email;
                this.emailService.to_name = user.first_name + ' ' + user.last_name;
                this.emailService.subject = 'Password Reset';
                this.emailService.body = data.device == 'mobile' ? uuid : '<a href="' + data.url + '/reset-password/' + uuid + '">Please follow this link to reset your password</a>'; // MODIFY: must be a template from the database

                const newEmail = await this.emailService.create();
                if (newEmail) {
                    return {
                        status: true, data: fields
                    };
                }
                return {
                    status: true, data: fields
                };
            }
            return false;
        }
        return false;
    }

    async resetPassword(data: any): Promise<any> {
        const password = await this.accountService.getHash(data.password);
        const account = await this.getResetToken(data.token);
        console.log(1, account);
        const fields = { password };
        return await this.accountService.update(account.pk, fields);
    }

    async getResetToken(token: string): Promise<any> {
        return await this.accountService.findToken(token);
    }


}
