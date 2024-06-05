import { Module } from '@nestjs/common';
import { ApplicationService } from 'src/application/application.service';
import { ApplicationQueryHelpersService } from './application-query-helpers/application-query-helpers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from 'src/application/entities/application.entity';
import { Email } from 'src/email/entities/email.entity';
import { Template } from 'src/template/entities/template.entity';
import { TemplateService } from 'src/template/template.service';

@Module({
    imports: [TypeOrmModule.forFeature([Application, Email, Template])],
    providers: [ApplicationService, ApplicationQueryHelpersService, TemplateService],
    exports: [ApplicationQueryHelpersService],
})
export class ApplicationHelpersModule { }
