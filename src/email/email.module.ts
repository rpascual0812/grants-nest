import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Email } from './entities/email.entity';
import { Validation } from 'src/validation/entities/validation.entity';
import { ValidationService } from 'src/validation/validation.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Email, Validation]),
    ],
    controllers: [EmailController],
    providers: [EmailService, ValidationService],
    exports: [EmailService]
})
export class EmailModule { }
