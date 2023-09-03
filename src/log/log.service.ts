import { Injectable } from '@nestjs/common';
import dataSource from 'db/data-source';
import { Log } from './entities/log.entity';

@Injectable()
export class LogService {
    async findAll(filter: any) {
        return await dataSource.getRepository(Log)
            .createQueryBuilder('logs')
            .leftJoinAndSelect("logs.user", "users")
            .where("model = :entity", { entity: filter.entity })
            .andWhere("model_pk = :pk", { pk: filter.pk })
            .orderBy('logs.pk', 'DESC')
            .skip(filter.skip)
            .take(filter.take)
            .getMany()
            ;
    }
}
