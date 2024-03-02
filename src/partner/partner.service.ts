import { Injectable } from '@nestjs/common';
import dataSource from 'db/data-source';
import { Partner } from './entities/partner.entity';

@Injectable()
export class PartnerService {

    async fetch() {
        return await dataSource.manager
            .getRepository(Partner)
            .createQueryBuilder('partners')
            .where('partners.archived = false')
            .getMany();
    }

    async fetchOne(pk: number) {
        return await dataSource.manager
            .getRepository(Partner)
            .createQueryBuilder('partners')
            .where('partners.pk = :pk', { pk })
            .where('partners.archived = false')
            .getMany();
    }
}
