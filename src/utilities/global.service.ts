import { Injectable, UsePipes, ValidationPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dataSource from 'db/data-source';
import { Log } from 'src/log/entities/log.entity';
import { DateTime } from 'luxon';
import { Partner } from 'src/partner/entities/partner.entity';
import { Application } from 'src/application/entities/application.entity';

export interface SaveLogModel {
    model: {
        pk: number;
        name: string;
        status: string;
    };
    user: {
        pk: number;
    };
}

@Injectable()
export class GlobalService {
    constructor() { }

    async saveLog(data: Partial<SaveLogModel>): Promise<any> {
        return dataSource
            .getRepository(Log)
            .createQueryBuilder('logs')
            .insert()
            .into(Log)
            .values([
                {
                    model: data?.model?.name,
                    model_pk: data?.model?.pk,
                    details: JSON.stringify({
                        pk: data?.model?.pk,
                        user_pk: data?.user?.pk,
                        status: data?.model?.status,
                        date_created: DateTime.now,
                    }),
                    user_pk: data?.user?.pk,
                },
            ])
            .execute();
    }

    async saveError(data: any): Promise<any> {
        console.log(data);
        console.log('Saving errors from the global service...');
    }

    async setApplicationNumber() {
        const date = DateTime.now();
        const keyword = date.toFormat('yyLLdd');
        const latest = await dataSource.manager
            .getRepository(Application)
            .createQueryBuilder('applications')
            .where('number like :number', { number: `${keyword}%` })
            .where('archived = false')
            .orderBy('number', 'DESC')
            .getOne();

        let application_number = keyword + '00001';
        if (latest) {
            const new_number = parseInt(latest.number.slice(6)) + 1;
            application_number = keyword + new_number.toString().padStart(5, '0');
        }

        return application_number;
    }

    async setPartnerId() {
        const date = DateTime.now();
        const year = date.toFormat('yyyy');

        const lastPartner = await dataSource.manager
            .getRepository(Partner)
            .createQueryBuilder('partners')
            .where('partner_id like :partner_id', { partner_id: `${year}%` })
            .orderBy('partner_id', 'DESC')
            .limit(1)
            .getOne();
        const newPartnerId = lastPartner ? parseInt(lastPartner.partner_id.slice(4)) + 1 : 1;
        return year + newPartnerId.toString().padStart(5, '0');
    }
}
