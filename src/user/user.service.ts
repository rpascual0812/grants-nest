import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import dataSource from 'db/data-source';
import { Account } from 'src/account/entities/account.entity';
import { Role } from 'src/role/entities/role.entity';
import { DateTime, DurationObjectUnits } from 'luxon';
import { AccountService } from 'src/account/account.service';
import { EmailService } from 'src/email/email.service';
import { SessionService } from 'src/session/session.service';
import { Document } from 'src/document/entities/document.entity';
import { UserRole } from './entities/user-role.entity';
import { GlobalService } from 'src/utilities/global.service';
import { TemplateService } from 'src/template/template.service';

// import { Document } from 'src/documents/entities/document.entity';
// import { UserDocument } from './entities/user-document.entity';
// import { UserAddress } from './entities/user-address.entity';
// import { SellerAddress } from 'src/seller/entities/seller-address.entity';

// import { Log } from 'src/logs/entities/log.entity';

// import { Province } from 'src/provinces/entities/province.entity';
// import { City } from 'src/cities/entities/city.entity';
// import { Area } from 'src/areas/entities/area.entity';
// import { Notification } from 'src/notifications/entities/notification.entity';

// export type User = {
//     id: number;
//     name: string;
//     username: string;
//     password: string;
// }

@Injectable()
export class UserService extends GlobalService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private accountService: AccountService,
        private emailService: EmailService,
        private sessionService: SessionService,
        private templateService: TemplateService
    ) {
        super();
    }

    async findAll(data: any, filters: any) {
        try {

            let orderByColumn,
                orderByDirection;
            if (filters.hasOwnProperty('orderBy')) {
                switch (filters.orderBy) {
                    case 'Sort by Name':
                        orderByColumn = 'users.first_name';
                        orderByDirection = 'ASC';
                        break;
                    default:
                        orderByColumn = 'users.date_created';
                        orderByDirection = 'DESC';
                }
            }
            else {
                orderByColumn = 'users.pk';
                orderByDirection = 'ASC';
            }

            const users = await dataSource
                .manager
                .getRepository(User)
                .createQueryBuilder('users')
                .select('users')
                .leftJoinAndSelect("users.account", "accounts")
                .addSelect(["accounts.pk", "accounts.username", "accounts.active", "accounts.verified"])
                .leftJoinAndSelect('users.documents', 'documents')
                .leftJoinAndSelect("users.gender", "genders")
                .addSelect(['genders.pk', 'genders.name'])
                .leftJoinAndSelect("users.user_role", "user_roles")
                .leftJoinAndMapOne(
                    'user_roles.role',
                    Role,
                    'roles',
                    'user_roles.role_pk=roles.pk'
                )
                // .leftJoinAndMapOne(
                //     'users.documentable',
                //     Documentable,
                //     'documentable',
                //     'users.pk=documentable.table_pk and documentable.table_name = \'users\''
                // )
                // .leftJoinAndMapOne(
                //     'documentable.document',
                //     Document,
                //     'documents',
                //     'documentable.document_pk=documents.pk',
                // )
                .andWhere(
                    filters.hasOwnProperty('keyword') && filters.keyword != '' ?
                        "(users.first_name ILIKE :keyword or users.last_name ILIKE :keyword or users.middle_name ILIKE :keyword or users.unique_id ILIKE :keyword)" :
                        '1=1', { keyword: `%${filters.keyword}%` }
                )
                .andWhere(
                    filters.hasOwnProperty('archived') && filters.archived != '' ?
                        "users.archived = :archived" :
                        '1=1', { archived: `${filters.archived}` }
                )
                // .andWhere("role_pk != 1")
                .skip(filters.skip)
                .take(filters.take)
                .orderBy(orderByColumn, orderByDirection)
                .getManyAndCount()
                ;

            return {
                status: true,
                data: users[0],
                total: users[1]
            }
        } catch (error) {
            console.log(error);
            // SAVE ERROR
            return {
                status: false
            }
        }
    }

    async findOne(data: any) {
        return await dataSource
            .manager
            .getRepository(User)
            .createQueryBuilder('users')
            .select('users')
            .leftJoinAndSelect("users.account", "accounts")
            .addSelect(["accounts.pk", "accounts.username", "accounts.active", "accounts.verified"])
            .leftJoinAndSelect('users.documents', 'documents')
            .leftJoinAndSelect("users.gender", "genders")
            .addSelect(['genders.pk', 'genders.name'])
            .leftJoinAndSelect("users.user_role", "user_roles")
            .leftJoinAndMapOne(
                'user_roles.role',
                Role,
                'roles',
                'user_roles.role_pk=roles.pk'
            )
            // .leftJoinAndMapOne(
            //     'users.documentable',
            //     Documentable,
            //     'documentable',
            //     'users.pk=documentable.user_pk and documentable.table_name = \'users\''
            // )
            // .leftJoinAndMapOne(
            //     'documentable.document',
            //     Document,
            //     'documents',
            //     'documentable.document_pk=documents.pk',
            // )
            .where("users.pk = :pk", { pk: data.pk })
            .getOne()
            ;
    }

    async find(user: any) {
        return await dataSource
            .manager
            .getRepository(User)
            .createQueryBuilder('users')
            .select('users')
            .leftJoinAndSelect("users.account", "accounts")
            .addSelect(["accounts.pk", "accounts.username", "accounts.active", "accounts.verified"])
            .leftJoinAndSelect('users.documents', 'documents')
            .leftJoinAndSelect("users.user_role", "user_roles")
            .leftJoinAndSelect("user_roles.role", "roles")
            // .leftJoinAndMapOne(
            //     'users.documentable',
            //     Documentable,
            //     'documentable',
            //     'users.pk=documentable.user_pk and documentable.table_name = \'users\''
            // )
            // .leftJoinAndMapOne(
            //     'documentable.document',
            //     Document,
            //     'documents',
            //     'documentable.document_pk=documents.pk',
            // )
            .where("accounts.pk = :pk", { pk: user.account.pk })
            .getOne()
            ;
    }

    async findByEmail(email_address: String): Promise<User | undefined> {
        return await dataSource
            .manager
            .getRepository(User)
            .createQueryBuilder('users')
            .where("email_address = :email_address", { email_address })
            .orderBy('pk', 'DESC')
            .getOne()
            ;
    }

    async uploadPhoto(user: any, file: any) {
        return {
            affected: 1
        };
        // change to add row to documents table
        // return await getRepository(User)
        //     .createQueryBuilder('users')
        //     .update()
        //     .set({ photo: file.path })
        //     .where("account_pk = :pk", { pk: user.pk })
        //     .execute();
    }

    async findLast(user: any) {
        return await dataSource
            .manager
            .getRepository(User)
            .createQueryBuilder('users')
            .leftJoinAndSelect("users.account", "accounts")
            .select('users')
            .addSelect(["accounts.pk", "accounts.username", "accounts.active", "accounts.verified"])
            .orderBy('users.pk', 'DESC')
            .getOne()
            ;
    }

    async save(data: any, user: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(
                async (EntityManager) => {
                    let userData = {};

                    // update user
                    if (data.pk) {
                        // delete existing user roles
                        await this.deleteRoles(data.pk);

                        const _user = await EntityManager.findOne(User, { where: { pk: data.pk } });
                        _user.first_name = data.first_name;
                        _user.last_name = data.last_name;
                        _user.gender_pk = data.gender;
                        _user.birthdate = data.birthdate;
                        _user.email_address = data.email_address;
                        _user.mobile_number = data.mobile;
                        userData = await EntityManager.save(_user);

                        // update the profile photo
                        if (data.image) {
                            EntityManager.query(
                                'insert into document_user_relation (document_pk, user_pk) values ($1 ,$2) ON CONFLICT DO NOTHING;',
                                [data.image.pk, data.pk],
                            );
                            // let profilePhoto = await EntityManager.findOne(Documentable, { where: { table_name: 'users', table_pk: data.pk, type: 'profile_photo' } });
                            // if (profilePhoto) {
                            //     await EntityManager.update(Documentable, { pk: profilePhoto.pk }, { document_pk: data.image.pk });
                            // }
                            // else {
                            //     const document = new Documentable();
                            //     document.table_name = 'users';
                            //     document.table_pk = data.pk;
                            //     document.document_pk = data.image.pk;
                            //     await EntityManager.save(document);
                            // }
                        }

                        // update the roles
                        if (data.roles.length > 0) {
                            let roles = [];
                            data.roles.forEach(role => {
                                roles.push({
                                    user_pk: data.pk,
                                    role_pk: role.pk
                                });
                            });

                            // insert new roles
                            await EntityManager.insert(UserRole, roles);
                        }
                    }
                    else { // add new user
                        let result = '';
                        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                        const charactersLength = characters.length;
                        let counter = 0;
                        while (counter < 6) {
                            result += characters.charAt(Math.floor(Math.random() * charactersLength));
                            counter += 1;
                        }
                        const password = await this.accountService.getHash(result);

                        const account = new Account();
                        account.username = data.email_address;
                        account.password = password;
                        account.active = true;
                        account.verified = true;
                        const newAccount = await EntityManager.save(account);

                        // generate unique_id
                        const lastUser = await this.findLast(data);
                        let uniqueId = parseInt(lastUser.unique_id) + 1;

                        // create user
                        const _user = new User();
                        _user.account_pk = newAccount.pk;
                        _user.uuid = uuidv4();
                        _user.unique_id = uniqueId.toString();
                        _user.last_name = data.last_name;
                        _user.first_name = data.first_name;
                        _user.middle_name = data.middle_name;
                        _user.birthdate = data.birthdate;
                        _user.mobile_number = data.mobile;
                        _user.email_address = data.email_address;


                        const templateObj = await this.templateService.find('newAccountCreated');
                        let template: string = '';

                        if (templateObj.status) {
                            template = templateObj?.data?.template;
                            console.log(result);
                            template = template.replace(/{first_name}/g, data.first_name);
                            template = template.replace(/{last_name}/g, data.last_name);
                            template = template.replace(/{middle_name}/g, data.middle_name);
                            template = template.replace(/{email_address}/g, data.email_address);
                            template = template.replace(/{unique_id}/g, uniqueId.toString());
                            template = template.replace(/{temporary_password}/g, result);
                            template = template.replace(/{app_url}/g, data.link);

                            // send email
                            this.emailService.uuid = uuidv4();
                            this.emailService.user_pk = user.pk;
                            this.emailService.from = process.env.SEND_FROM;
                            this.emailService.from_name = process.env.SENDER;
                            this.emailService.to = data.email_address;
                            this.emailService.to_name = '';
                            this.emailService.subject = templateObj?.data?.subject ?? 'Grants Application';
                            this.emailService.body = template;

                            await this.emailService.create();
                        }

                        const newUser = await EntityManager.save(_user);
                        userData = newUser;

                        // create user document
                        if (data.image) {
                            EntityManager.query(
                                'insert into document_user_relation (document_pk, user_pk) values ($1 ,$2) ON CONFLICT DO NOTHING;',
                                [data.image.pk, data.pk],
                            );
                            // const documentable = new Documentable();
                            // documentable.table_name = 'users';
                            // documentable.table_pk = newUser.pk;
                            // documentable.document_pk = data.image.pk;
                            // await EntityManager.save(documentable);
                        }
                    }

                    const updatedUser = await this.findOne(userData);

                    return { status: true, data: updatedUser };
                }
            );
        } catch (err) {
            console.log(err);
            return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }

    }

    async update(user, pk: any, data: any) {
        console.log(user, pk, data);
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(
                async (EntityManager) => {
                    const user = await EntityManager.update(User, { pk }, data);

                    // Add logs here

                    return { status: true, data: user };
                }
            );
        } catch (err) {
            console.log(err);
            return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }

    }

    async deleteRoles(user_pk: any) {
        try {
            return await dataSource
                .manager
                .createQueryBuilder()
                .delete()
                .from(UserRole)
                .where("user_pk = :user_pk", { user_pk })
                .execute();
        } catch (err) {
            console.log(err);
            return { status: false, code: err.code };
        }
    }

    async delete(data: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(
                async (EntityManager) => {
                    const user = await EntityManager.findOne(User, data.pk);
                    user.archived = true;
                    await EntityManager.save(user);

                    const account = await EntityManager.findOne(Account, data.account.pk);
                    account.archived = true;
                    const updatedAccount = await EntityManager.save(account);

                    // // LOGS
                    // const log = new Log();
                    // log.model = 'users';
                    // log.model_pk = user.pk;
                    // log.details = JSON.stringify({
                    //     archived: true,
                    // });
                    // log.user_pk = user.pk;
                    // await EntityManager.save(log);

                    return { status: true, data: updatedAccount };
                }
            );
        } catch (err) {
            console.log(err);
            return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }

    }

    async sendResetPassword(user: any, pk: any, body: any) {
        const selectedUser = await this.findOne({ pk });

        if (selectedUser) {
            let uuid = uuidv4();

            await this.accountService.clearPassword(selectedUser.account_pk);
            await this.sessionService.removeByAccount(selectedUser.account_pk);

            const fields = { password_reset: { token: uuid, expiration: DateTime.now().plus({ hours: 1 }) } };
            const updated = await this.accountService.update(user, user.account_pk, fields);

            if (updated) {
                const templateObj = await this.templateService.find('passwordReset');

                let template: string = '';
                if (templateObj.status) {
                    template = templateObj?.data?.template;

                    template = template.replace(/{first_name}/g, user.first_name);
                    template = template.replace(/{middle_name}/g, user.middle_name);
                    template = template.replace(/{last_name}/g, user.last_name);
                    template = template.replace(/{email_address}/g, user.email_address);
                    template = template.replace(/{unique_id}/g, user.unique_id);
                    template = template.replace(/{reset_password_url}/g, body.url + '/reset-password/' + uuid);

                    this.emailService.account_pk = user.account_pk;
                    this.emailService.user_pk = user.pk;
                    this.emailService.from = process.env.SEND_FROM;
                    this.emailService.from_name = process.env.SENDER;
                    this.emailService.to = selectedUser.email_address;
                    this.emailService.to_name = user.first_name + ' ' + user.last_name;
                    this.emailService.subject = templateObj?.data?.subject ?? 'Password Reset';
                    this.emailService.body = template;

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
            }
            return false;
        }
        return false;
    }

    async updateRoles(data, user) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {

                await dataSource
                    .createQueryBuilder()
                    .delete()
                    .from(UserRole)
                    .where('user_pk = :pk', { pk: data.pk })
                    .execute();

                let roles = [];
                data.roles.forEach(role => {
                    roles.push(
                        {
                            user_pk: data.pk,
                            role_pk: role.pk
                        }
                    );
                });

                const role = await dataSource
                    .createQueryBuilder()
                    .insert()
                    .into(UserRole)
                    .values(roles)
                    .returning('*')
                    .execute();

                return { status: true };
            });
        } catch (err) {
            console.log(err);
            this.saveError({});
            return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }
    }
}
