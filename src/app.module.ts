import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from '../db/data-source';
import { EmailModule } from './email/email.module';
import { ValidationModule } from './validation/validation.module';
import { AuthModule } from './auth/auth.module';
import { GenderModule } from './gender/gender.module';
import { RoleModule } from './role/role.module';
import { DocumentModule } from './document/document.module';
import { LogModule } from './log/log.module';
import { ApplicationModule } from './application/application.module';
import { CheckService } from './cron/check/check.service';
import { MailerService } from './cron/mailer/mailer.service';
import { ScheduleModule } from '@nestjs/schedule';
import { DestroyerService } from './cron/destroyer/destroyer.service';
import { OrganizationModule } from './organization/organization.module';
import { CountryModule } from './country/country.module';
import { ProvinceModule } from './province/province.module';
import { PartnerModule } from './partner/partner.module';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        TypeOrmModule.forRoot(dataSourceOptions),
        AuthModule,
        EmailModule,
        ValidationModule,
        GenderModule,
        RoleModule,
        DocumentModule,
        LogModule,
        ApplicationModule,
        OrganizationModule,
        CountryModule,
        ProvinceModule,
        ApplicationModule,
        PartnerModule
    ],
    controllers: [AppController],
    providers: [AppService, CheckService, MailerService, DestroyerService],
})
export class AppModule { }
