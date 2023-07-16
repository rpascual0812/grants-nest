import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { Account } from 'src/account/entities/account.entity';
import { AccountService } from 'src/account/account.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Account]),
    ],
    controllers: [UserController],
    providers: [UserService, AccountService],
    exports: [UserService]
})
export class UserModule { }
