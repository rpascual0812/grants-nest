import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { EmailService } from 'src/email/email.service';
import { Email } from 'src/email/entities/email.entity';
import { SessionService } from 'src/session/session.service';
import { Session } from 'src/session/entities/session.entity';
import { Template } from 'src/template/entities/template.entity';
import { TemplateService } from 'src/template/template.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Account, User, Email, Session, Template]),
    ],
    controllers: [AccountController],
    providers: [AccountService, UserService, EmailService, SessionService, TemplateService],
    exports: [AccountService]
})
export class AccountModule { }
