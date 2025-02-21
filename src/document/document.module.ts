import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Document } from './entities/document.entity';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
    imports: [
        ThrottlerModule.forRoot([{
            ttl: 60000, // you can only use the same request 100 times within 60 seconds
            limit: 200,
        }]),
        TypeOrmModule.forFeature([Document]),
        ConfigModule.forRoot({ isGlobal: true })
    ],
    controllers: [DocumentController],
    providers: [
        DocumentService,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        }
    ],
    exports: [DocumentService]
})
export class DocumentModule { }
