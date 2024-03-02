import { Injectable } from '@nestjs/common';
import dataSource from 'db/data-source';
import { Partner } from './entities/partner.entity';

@Injectable()
export class PartnerService {

    async fetch() {
        try {
            const partners = await dataSource.manager
                .getRepository(Partner)
                .createQueryBuilder('partners')
                .select('partners')
                .where('partners.archived=false')
                .orderBy('partners.name')
                .getManyAndCount();

            return {
                status: true,
                data: partners[0],
                total: partners[1],
            };
        } catch (error) {
            return {
                status: false,
                code: 500,
            };
        }
    }

    async fetchOne(pk: number) {
        return await dataSource.manager
            .getRepository(Partner)
            .createQueryBuilder('partners')
            .where('partners.pk = :pk', { pk })
            .where('partners.archived = false')
            .getOne();
    }
}
