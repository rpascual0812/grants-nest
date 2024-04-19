import { Module } from '@nestjs/common';
import { ApplicationService } from 'src/application/application.service';
import { ApplicationQueryHelpersService } from './application-query-helpers/application-query-helpers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from 'src/application/entities/application.entity';
import { Email } from 'src/email/entities/email.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Application, Email])],
    providers: [ApplicationService, ApplicationQueryHelpersService],
    exports: [ApplicationQueryHelpersService],
})
export class ApplicationHelpersModule {}
