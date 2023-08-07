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

@Module({
    imports: [
        TypeOrmModule.forRoot(dataSourceOptions),
        AuthModule,
        EmailModule,
        ValidationModule,
        GenderModule,
        RoleModule,
        DocumentModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
