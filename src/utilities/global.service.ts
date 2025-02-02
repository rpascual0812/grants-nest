import { Injectable } from '@nestjs/common';
import dataSource from 'db/data-source';
import { Log } from 'src/log/entities/log.entity';
import { DateTime } from 'luxon';
import { Partner } from 'src/partner/entities/partner.entity';
import { Application } from 'src/application/entities/application.entity';
import { PartnerOrganization } from 'src/partner/entities/partner-organization.entity';
import { whereCountry } from 'iso-3166-1';

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

    async setApplicationNumber(pk: number, country_code: string) {
        const date = DateTime.now();
        const keyword = date.toFormat('yyyyLLdd');
        const latest = await dataSource.manager
            .getRepository(Application)
            .createQueryBuilder('applications')
            .where('applications.pk != :pk', { pk: pk })
            .andWhere('number like :number', { number: `${keyword}%` })
            .andWhere('archived = false')
            .orderBy('number', 'DESC')
            .getOne();

        let application_number = keyword + '-' + country_code + '-' + '0001';
        if (latest && latest.number) {
            const new_number = parseInt(latest.number.slice(-4)) + 1;
            application_number = keyword + '-' + country_code + '-' + new_number.toString().padStart(4, '0');
        }

        return application_number;
    }

    async setPartnerId(partnerPk: number) {
        const date = DateTime.now();
        const year = date.toFormat('yyyy');

        const lastPartner = await dataSource.manager
            .getRepository(Partner)
            .createQueryBuilder('partners')
            .where(`SPLIT_PART(partner_id, '-', 3) = :year`, { year })
            .orderBy('partner_id', 'DESC')
            .limit(1)
            .getOne();

        const partnerOrg = await dataSource.manager
            .getRepository(PartnerOrganization)
            .createQueryBuilder('partner_organizations')
            .leftJoinAndSelect('partner_organizations.organization_partner_type', 'organization_partner_types')
            .leftJoinAndSelect('partner_organizations.country', 'countries')
            .where(`partner_organizations.partner_pk = :pk`, { pk: partnerPk })
            .getOne();

        const partnerType = partnerOrg.organization_partner_type.type;
        const partnerCountry = partnerOrg.country.name;
        const isoAlpha3Country = whereCountry(partnerCountry).alpha3;

        const splitted = lastPartner?.partner_id?.split('-');
        const parsed = parseInt(splitted?.at(0)) + 1 || 1;
        const stringifiedId = parsed.toString().padStart(5, '0');
        return `${stringifiedId}-${isoAlpha3Country}-${year}-${partnerType}`;
    }
}
