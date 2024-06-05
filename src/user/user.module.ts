import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { Account } from 'src/account/entities/account.entity';
import { AccountService } from 'src/account/account.service';
import { EmailService } from 'src/email/email.service';
import { Email } from 'src/email/entities/email.entity';
import { Session } from 'src/session/entities/session.entity';
import { SessionService } from 'src/session/session.service';
import { Template } from 'src/template/entities/template.entity';
import { TemplateService } from 'src/template/template.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Account, Email, Session, Template]),
    ],
    controllers: [UserController],
    providers: [UserService, AccountService, EmailService, SessionService, TemplateService],
    exports: [UserService]
})
export class UserModule { }
