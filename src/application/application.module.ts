import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { EmailService } from 'src/email/email.service';
import { Email } from 'src/email/entities/email.entity';
import { ApplicationHelpersModule } from './utilities/lib/application-helpers.module';
import { ProjectsService } from 'src/projects/projects.service';
import { Project } from 'src/projects/entities/project.entity';
import { Template } from 'src/template/entities/template.entity';
import { TemplateService } from 'src/template/template.service';

@Module({
    imports: [TypeOrmModule.forFeature([Application, Email, Project, Template]), ApplicationHelpersModule],
    controllers: [ApplicationController],
    providers: [ApplicationService, EmailService, ProjectsService, TemplateService],
})
export class ApplicationModule { }
