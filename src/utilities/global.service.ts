import { Injectable, UsePipes, ValidationPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dataSource from 'db/data-source';
import { Log } from 'src/log/entities/log.entity';
import { DateTime } from "luxon";

@Injectable()
export class GlobalService {
    constructor(
    ) { }

    async saveLog(data: any): Promise<any> {
        return dataSource.getRepository(Log)
            .createQueryBuilder('logs')
            .insert()
            .into(Log)
            .values([
                {
                    model: data.model.name,
                    model_pk: data.model.pk,
                    details: JSON.stringify({
                        pk: data.model.pk,
                        user_pk: data.user.pk,
                        status: data.model.status,
                        date_created: DateTime.now
                    }),
                    user_pk: data.user.pk
                }
            ])
            .execute()
            ;
    }

    async saveError(data: any): Promise<any> {
        console.log('Saving errors from the global service...');
    }
}
