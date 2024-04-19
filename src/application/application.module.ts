import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { EmailService } from 'src/email/email.service';
import { Email } from 'src/email/entities/email.entity';
import { ApplicationHelpersModule } from './utilities/lib/application-helpers.module';

@Module({
    imports: [TypeOrmModule.forFeature([Application, Email]), ApplicationHelpersModule],
    controllers: [ApplicationController],
    providers: [ApplicationService, EmailService],
})
export class ApplicationModule {}
