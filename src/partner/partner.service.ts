import { Injectable } from '@nestjs/common';
import dataSource from 'db/data-source';
import { Partner } from './entities/partner.entity';
import { PartnerOrganization } from './entities/partner-organization.entity';
import { PartnerContact } from './entities/partner-contacts.entity';
import { Country } from 'src/country/entities/country.entity';
import { Application } from 'src/application/entities/application.entity';

@Injectable()
export class PartnerService {
    async findAll(filters?: { organization_pk: number; type_pk: number }) {
        try {
            const organizationPk = filters?.organization_pk ?? null;
            const typePk = filters?.type_pk ?? null;
            const partners = await dataSource.manager
                .getRepository(Partner)
                .createQueryBuilder('partners')
                .select('partners')
                .leftJoinAndMapOne(
                    'partners.organization',
                    PartnerOrganization,
                    'partner_organizations',
                    'partners.pk=partner_organizations.partner_pk',
                )
                .leftJoinAndMapOne(
                    'partner_organizations.country',
                    Country,
                    'countries',
                    'partner_organizations.country_pk=countries.pk',
                )
                .leftJoinAndMapMany(
                    'partners.contacts',
                    PartnerContact,
                    'partner_contacts',
                    'partners.pk=partner_contacts.partner_pk',
                )
                .leftJoinAndMapMany(
                    'partners.application',
                    Application,
                    'applications',
                    'partners.pk=applications.partner_pk',
                )
                .leftJoinAndSelect('applications.project', 'projects')
                .leftJoinAndSelect('applications.application_proposal', 'application_proposal')
                .leftJoinAndSelect('applications.application_statuses', 'application_statuses')
                .leftJoinAndSelect('application_statuses.status', 'statuses')
                .leftJoinAndSelect('applications.types', 'type_application_relation')
                .where('partners.archived=false')
                .andWhere(organizationPk ? 'partner_organizations.organization_pk = :organizationPk' : '1=1', {
                    organizationPk,
                })
                .andWhere(typePk ? 'type_application_relation.pk = :typePk' : '1=1', {
                    typePk,
                })
                .orderBy('partners.name')
                .getManyAndCount();

            return {
                status: true,
                data: partners[0],
                total: partners[1],
            };
        } catch (error) {
            console.log(error);
            return {
                status: false,
                code: 500,
            };
        }
    }

    async find(pk: number) {
        return await dataSource.manager
            .getRepository(Partner)
            .createQueryBuilder('partners')
            .where('partners.pk = :pk', { pk })
            .where('partners.archived = false')
            .getOne();
    }

    async save(data: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        console.log('saving link', data);
        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                return { status: true, data: {} };
            });
        } catch (err) {
            console.log(err);
            return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }
    }
}
