import { Injectable, UsePipes, ValidationPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dataSource from 'db/data-source';
import { Session } from './entities/session.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SessionService {
    constructor(
        @InjectRepository(Session)
        private sessionRepository: Repository<Session>,
    ) { }

    @UsePipes(ValidationPipe)
    async create(account: any): Promise<any> {
        this.removeByAccount(account.pk);

        const obj: any = {
            token: account.access_token,
            expiration: account.expiration,
            account: account.pk,
        }

        const newSession = this.sessionRepository.create(obj);
        return this.sessionRepository.save(newSession);
    }

    async removeByAccount(pk: number): Promise<any> {
        return await dataSource
            .manager
            .getRepository(Session)
            .createQueryBuilder()
            .delete()
            .from('sessions')
            .where({ account: pk })
            .execute()
            ;
    }
}
