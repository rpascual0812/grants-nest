import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { v4 as uuidv4 } from 'uuid';
import { DateTime } from "luxon";
import { AccountService } from 'src/account/account.service';
import { UserService } from 'src/user/user.service';
import { EmailService } from 'src/email/email.service';
import { SessionService } from 'src/session/session.service';
import { TemplateService } from 'src/template/template.service';

@Injectable()
export class AuthService {

    constructor(
        private accountService: AccountService,
        private sessionService: SessionService,
        private emailService: EmailService,
        private userService: UserService,
        private jwtService: JwtService,
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

        const { pk, password, verified, date_created, archived, password_reset, ...others } = account;
        return others;
    }

    async logout(user: any) {
        return await this.sessionService.removeByAccount(user.pk);
    }

    async forgotPassword(data: any) {
        const user = await this.userService.findByEmail(data.email);
        return this.userService.sendResetPassword(user, user.pk, data);
    }

    async resetPassword(data: any): Promise<any> {
        const password = await this.accountService.getHash(data.password);
        const account = await this.getResetToken(data.token);

        const fields = { password };
        return await this.accountService.update({}, account.pk, fields);
    }

    async getResetToken(token: string): Promise<any> {
        return await this.accountService.findToken(token);
    }


}
