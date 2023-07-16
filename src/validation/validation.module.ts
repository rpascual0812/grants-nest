import { Module } from '@nestjs/common';
import { ValidationService } from './validation.service';
import { ValidationController } from './validation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Validation } from './entities/validation.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Validation]),
    ],
    controllers: [ValidationController],
    providers: [ValidationService],
    exports: [ValidationService]
})
export class ValidationModule { }
