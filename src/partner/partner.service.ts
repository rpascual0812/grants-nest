import { getParsedPk } from './../application/utilities/get-parsed-pk.utils';
import { Injectable } from '@nestjs/common';
import dataSource from 'db/data-source';
import { Partner } from './entities/partner.entity';
import { PartnerOrganization } from './entities/partner-organization.entity';
import { PartnerContact } from './entities/partner-contacts.entity';
import { Country } from 'src/country/entities/country.entity';
import { Application } from 'src/application/entities/application.entity';
import { PartnerOrganizationReference } from './entities/partner-organization-references.entity';
import { Project } from 'src/projects/entities/project.entity';
import { PartnerOrganizationBank } from './entities/partner-organization-bank.entity';
import { PartnerOrganizationOtherInformation } from './entities/partner-organization-other-information.entity';
import { PartnerAssessment } from './entities/partner-assessment.entity';
import { User } from 'src/user/entities/user.entity';
import { Equal } from 'typeorm';
import { getDefaultValue } from 'src/application/utilities/get-default-value.utils';
import { GlobalService } from 'src/utilities/global.service';

@Injectable()
export class PartnerService extends GlobalService {
    async findAll(filters?: { organization_pk: number; type_pk: number; keyword: string }) {
        try {
            const organizationPk = filters?.organization_pk ?? null;
            const typePk = filters?.type_pk ?? null;
            const keyword = filters?.keyword ?? null;
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
                    'partners.applications',
                    Application,
                    'applications',
                    'partners.pk=applications.partner_pk',
                )
                .leftJoinAndSelect(
                    'partners.partner_nonprofit_equivalency_determination',
                    'partner_nonprofit_equivalency_determination',
                )
                .leftJoinAndSelect('applications.project', 'projects')
                .leftJoinAndSelect('projects.project_proposal', 'project_proposals')
                .leftJoinAndSelect('applications.statuses', 'application_statuses')
                .leftJoinAndSelect('applications.types', 'type_application_relation')
                .where('partners.archived=false')
                .andWhere(organizationPk ? 'partner_organizations.organization_pk = :organizationPk' : '1=1', {
                    organizationPk,
                })
                .andWhere(typePk ? 'type_application_relation.pk = :typePk' : '1=1', {
                    typePk,
                })
                .andWhere(keyword ? 'partners.name ILIKE :keyword' : '1=1', {
                    keyword: `%${keyword}%`,
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

    async find(filter: { pk?: number; partner_id?: number }) {
        try {
            const data = await dataSource.manager
                .getRepository(Partner)
                .createQueryBuilder('partners')
                .leftJoinAndSelect('partners.documents', 'documents')
                .leftJoinAndMapOne(
                    'partners.organization',
                    PartnerOrganization,
                    'partner_organizations',
                    'partners.pk=partner_organizations.partner_pk',
                )
                .leftJoinAndMapMany(
                    'partner_organizations.partner_organization_reference',
                    PartnerOrganizationReference,
                    'partner_organization_references',
                    'partner_organizations.pk=partner_organization_references.partner_organization_pk',
                )
                .leftJoinAndMapOne(
                    'partner_organizations.partner_organization_bank',
                    PartnerOrganizationBank,
                    'partner_organization_banks',
                    'partner_organizations.pk=partner_organization_banks.partner_organization_pk',
                )
                .leftJoinAndMapOne(
                    'partner_organizations.partner_organization_other_information',
                    PartnerOrganizationOtherInformation,
                    'partner_organization_other_informations',
                    'partner_organizations.pk=partner_organization_other_informations.partner_organization_pk',
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
                .leftJoinAndSelect('partners.partner_fiscal_sponsor', 'partner_fiscal_sponsors')
                .leftJoinAndMapMany(
                    'partners.application',
                    Application,
                    'applications',
                    'partners.pk=applications.partner_pk',
                )
                .leftJoinAndSelect(
                    'partners.partner_nonprofit_equivalency_determination',
                    'partner_nonprofit_equivalency_determinations',
                )
                .leftJoinAndSelect('applications.project', 'projects')
                .leftJoinAndSelect('projects.project_proposal', 'project_proposals')
                .leftJoinAndSelect('applications.statuses', 'application_statuses')
                .leftJoinAndSelect('applications.types', 'type_application_relation')
                .leftJoinAndSelect('partner_fiscal_sponsors.documents', 'documents as fiscal_sponsor_documents')
                .leftJoinAndSelect(
                    'partner_nonprofit_equivalency_determinations.documents',
                    'documents as partner_nonprofit_equivalency_determination_documents',
                )
                .leftJoinAndSelect(
                    'partner_organization_other_informations.documents',
                    'documents as partner_organization_other_information_documents',
                )
                .where('partners.archived = false')
                .andWhere(filter.hasOwnProperty('pk') ? 'partners.pk = :pk' : '1=1', { pk: filter.pk })
                .andWhere(filter.hasOwnProperty('partner_id') ? 'partners.partner_id = :partner_id' : '1=1', {
                    partner_id: filter.partner_id,
                })
                .orderBy({
                    'partner_organization_references.pk': 'ASC',
                })
                .getOne();

            return {
                status: true,
                data,
            };
        } catch (err) {
            console.log(err);
            return {
                status: false,
                code: 500,
            };
        }
    }

    async findAssessments(partner_pk: number, query: any, users: Partial<User>) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            const data = await dataSource
                .getRepository(PartnerAssessment)
                .createQueryBuilder('partner_assessments')
                .leftJoinAndSelect('partner_assessments.user', 'users')
                .andWhere('partner_assessments.partner_pk = :partner_pk', { partner_pk })
                .andWhere('partner_assessments.archived = false')
                .orderBy('partner_assessments.date_created', 'DESC')
                .getManyAndCount();

            return {
                status: true,
                data: data[0],
                total: data[1],
            };
        } catch (err) {
            this.saveError({});
            console.log(err);
            return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }
    }

    async saveAssessment(data: Partial<PartnerAssessment>, user: Partial<User>) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                const partnerPk = getParsedPk(data?.partner_pk);
                const partnerAssessmentPk = getParsedPk(data?.pk);
                const userPk = getParsedPk(user?.pk);
                const existingAssessment = await EntityManager.findOne(PartnerAssessment, {
                    where: {
                        pk: Equal(partnerAssessmentPk),
                        partner_pk: Equal(partnerPk),
                        created_by: Equal(userPk),
                    },
                });

                const assessment = existingAssessment ? existingAssessment : new PartnerAssessment();
                assessment.partner_pk = partnerPk;
                assessment.created_by = userPk;
                assessment.message = getDefaultValue(data?.message, existingAssessment?.message);

                const savedAssessment = await EntityManager.save(PartnerAssessment, {
                    ...assessment,
                });

                const model = {
                    name: 'partner_assessments',
                    pk: savedAssessment?.pk,
                    status: existingAssessment ? 'update' : 'insert',
                };
                await this.saveLog({
                    model,
                    user: {
                        pk: userPk,
                    },
                });

                return {
                    status: true,
                    data: {
                        ...savedAssessment,
                    },
                };
            });
        } catch (err) {
            console.log(err);
            return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }
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
