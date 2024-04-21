import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dataSource from 'db/data-source';
import { GlobalService } from 'src/utilities/global.service';
import { Project } from './entities/project.entity';
import { EmailService } from 'src/email/email.service';
import { Partner } from 'src/partner/entities/partner.entity';
import { PartnerOrganization } from 'src/partner/entities/partner-organization.entity';
import { PartnerOrganizationReference } from 'src/partner/entities/partner-organization-references.entity';
import { Country } from 'src/country/entities/country.entity';
import { PartnerOrganizationBank } from 'src/partner/entities/partner-organization-bank.entity';
import { PartnerOrganizationOtherInformation } from 'src/partner/entities/partner-organization-other-information.entity';
import { PartnerOrganizationOtherInformationFinancialHumanResources } from 'src/partner/entities/partner-organization-other-information-financial-human-resources.entity';
import { PartnerContact } from 'src/partner/entities/partner-contacts.entity';
import { PartnerFiscalSponsor } from 'src/partner/entities/partner-fiscal-sponsor.entity';
import { PartnerNonprofitEquivalencyDetermination } from 'src/partner/entities/partner-nonprofit-equivalency-determination.entity';
import { Application } from 'src/application/entities/application.entity';
import { Document } from 'src/document/entities/document.entity';
import { Review } from 'src/review/entities/review.entity';
import { ProjectRecommendation } from './entities/project-recommendation.entity';

@Injectable()
export class ProjectsService extends GlobalService {

    constructor(
        @InjectRepository(Project)
        private emailService: EmailService,
    ) {
        super();
    }

    async findAll(filters: any) {
        try {
            const data = await dataSource
                .getRepository(Project)
                .createQueryBuilder('projects')
                .leftJoinAndSelect('projects.project_location', 'project_location')
                .leftJoinAndSelect('projects.project_beneficiary', 'project_beneficiary')
                .leftJoinAndSelect('projects.project_proposal', 'project_proposals')
                .leftJoinAndSelect('project_proposals.project_proposal_activity', 'project_proposal_activity')
                .leftJoinAndSelect('projects.type', 'types')
                .where('projects.archived = false')
                .orderBy('projects.date_created', 'DESC')
                .getManyAndCount();

            return {
                status: true,
                data: data[0],
                total: data[1],
            };
        } catch (error) {
            console.log(error);
            return {
                status: false,
                code: 500,
            };
        }
    }

    async find(filter: any, reviews?: any) {
        try {
            const data = await dataSource
                .getRepository(Project)
                .createQueryBuilder('projects')
                .leftJoinAndSelect('projects.documents', 'documents')
                .leftJoinAndSelect('projects.recommendations', 'project_recommendations')
                .leftJoinAndSelect('projects.project_location', 'project_location')
                .leftJoinAndSelect('projects.project_beneficiary', 'project_beneficiary')
                .leftJoinAndSelect('projects.project_proposal', 'project_proposals')
                .leftJoinAndSelect('project_proposals.project_proposal_activity', 'project_proposal_activity')
                .leftJoinAndSelect('projects.type', 'types')

                .andWhere(filter.hasOwnProperty('pk') ? 'projects.pk = :pk' : '1=1', { pk: filter.pk })
                .andWhere('projects.archived = :archived', { archived: false })
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

    async getApplication(pks: any) {
        try {
            return await dataSource
                .getRepository(Application)
                .createQueryBuilder('applications')
                .leftJoinAndSelect('applications.documents', 'documents')
                .leftJoinAndSelect('applications.recommendations', 'application_recommendations')
                .andWhere('applications.pk IN (:...pk)', { pk: pks })
                .getMany();
        } catch (error) {
            console.log(error);
            // SAVE ERROR
            return {
                status: false,
            };
        }
    }

    async getPartner(pks: any) {
        try {
            return await dataSource
                .getRepository(Partner)
                .createQueryBuilder('partners')
                .select('partners')
                .leftJoinAndSelect('partners.documents', 'documents as partner_documents')
                .where("partners.pk IN (:...pk)", { pk: pks })
                .getMany()
                ;
        } catch (error) {
            console.log(error);
            // SAVE ERROR
            return {
                status: false,
            };
        }
    }

    async getPartnerOrganization(pks: any) {
        try {
            return await dataSource
                .getRepository(PartnerOrganization)
                .createQueryBuilder('partner_organizations')
                .select('partner_organizations')
                .leftJoinAndMapMany(
                    'partner_organizations.partner_organization_reference',
                    PartnerOrganizationReference,
                    'partner_organization_references',
                    'partner_organizations.pk=partner_organization_references.partner_organization_pk',
                )
                .leftJoinAndMapOne(
                    'partner_organizations.country',
                    Country,
                    'countries',
                    'partner_organizations.country_pk=countries.pk',
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
                .leftJoinAndSelect(
                    'partner_organization_other_informations.documents',
                    'documents as partner_organization_other_information_documents',
                )
                .leftJoinAndMapMany(
                    'partner_organization_other_informations.organization_other_information_financial_human_resources',
                    PartnerOrganizationOtherInformationFinancialHumanResources,
                    'partner_organization_other_information_financial_human_resource',
                    'partner_organization_other_informations.pk=partner_organization_other_information_financial_human_resource.partner_organization_other_information_pk',
                )
                .where("partner_organizations.partner_pk IN (:...pk)", { pk: pks })
                .getMany()
                ;
        } catch (error) {
            console.log(error);
            // SAVE ERROR
            return {
                status: false,
            };
        }
    }

    async getPartnerContacts(pks: any) {
        try {
            return await dataSource
                .getRepository(PartnerContact)
                .createQueryBuilder('partner_contacts')
                .select('partner_contacts')
                .where("partner_contacts.partner_pk IN (:...pk)", { pk: pks })
                .getMany()
                ;
        } catch (error) {
            console.log(error);
            // SAVE ERROR
            return {
                status: false,
            };
        }
    }

    async getPartnerFiscalSponsor(pks: any) {
        try {
            return await dataSource
                .getRepository(PartnerFiscalSponsor)
                .createQueryBuilder('partner_fiscal_sponsors')
                .select('partner_fiscal_sponsors')
                .leftJoinAndSelect('partner_fiscal_sponsors.documents', 'documents as partner_fiscal_sponsors_documents')
                .where("partner_fiscal_sponsors.partner_pk IN (:...pk)", { pk: pks })
                .getMany()
                ;
        } catch (error) {
            console.log(error);
            // SAVE ERROR
            return {
                status: false,
            };
        }
    }

    async getPartnerNonprofitEquivalencyDetermination(pks: any) {
        try {
            return await dataSource
                .getRepository(PartnerNonprofitEquivalencyDetermination)
                .createQueryBuilder('partner_nonprofit_equivalency_determinations')
                .select('partner_nonprofit_equivalency_determinations')
                .leftJoinAndSelect('partner_nonprofit_equivalency_determinations.documents', 'documents as partner_nonprofit_equivalency_determinations_documents')
                .where("partner_nonprofit_equivalency_determinations.partner_pk IN (:...pk)", { pk: pks })
                .getMany()
                ;
        } catch (error) {
            console.log(error);
            // SAVE ERROR
            return {
                status: false,
            };
        }
    }

    async getReviews(pks: any) {
        try {
            return await dataSource
                .getRepository(Project)
                .createQueryBuilder('projects')
                .select('projects')
                .leftJoinAndSelect('projects.reviews', 'reviews')
                .leftJoinAndSelect('reviews.user', 'users')
                .leftJoinAndSelect('reviews.documents', 'documents as review_documents')
                .where("projects.pk IN (:...pk)", { pk: pks })
                .andWhere('reviews.archived = false')
                .orderBy('reviews.date_created', 'ASC')
                .getMany();
        } catch (error) {
            console.log(error);
            // SAVE ERROR
            return {
                status: false,
            };
        }
    }

    async saveAttachment(data: any, user: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                const project_pk = data?.project_pk;

                if (project_pk && data.file.pk) {
                    await EntityManager.update(Document, { pk: data.file.pk }, { type: data.type });

                    const document = await EntityManager.query(
                        'insert into document_project_relation (document_pk, project_pk) values ($1 ,$2) ON CONFLICT DO NOTHING;',
                        [data.file.pk, project_pk],
                    );
                    return {
                        status: document ? true : false,
                    };
                } else {
                    return {
                        status: false,
                        code: 500,
                        message: 'Project not found',
                    };
                }
            });
        } catch (err) {
            this.saveError({});
            console.log(err);
            return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }
    }

    async deleteAttachment(pk: number, document_pk: any, user: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                await EntityManager.query(
                    'delete from document_project_relation where document_pk = $1 and project_pk = $2;',
                    [document_pk, pk],
                );

                const doc = await EntityManager.update(Document, { pk: document_pk }, { archived: true });

                // save logs
                const model = {
                    pk: document_pk,
                    name: 'documents',
                    status: 'deleted',
                };
                await this.saveLog({ model, user });

                return {
                    status: doc ? true : false,
                };
            });
        } catch (err) {
            this.saveError({});
            console.log(err);
            return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }
    }

    async saveReview(data: any, user: any) {
        console.log(data);
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                const review = new Review();
                review.message = data.message;
                review.type = data.type;
                review.created_by = user.pk;
                review.documents = data.documents;
                const newReview = await dataSource.manager.save(review);

                if (newReview) {
                    let project = await Project.findOneBy({
                        pk: data.project_pk,
                    });

                    if (!project.status) {
                        project.status = 'Contract Preparation';
                        project.save();
                    }

                    await EntityManager.query(
                        'insert into review_project_relation (review_pk, project_pk) values ($1 ,$2) ON CONFLICT DO NOTHING;',
                        [newReview.pk, data.project_pk],
                    );

                    return {
                        status: true,
                        data: newReview,
                    };
                } else {
                    return {
                        status: false,
                        code: 500,
                        message: 'Application not found',
                    };
                }
            });
        } catch (err) {
            this.saveError({});
            console.log(err);
            return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }
    }

    async deleteReview(pk: number, user: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                const review = await EntityManager.update(Review, { pk }, { archived: true });

                // save logs
                const model = {
                    pk,
                    name: 'reviews',
                    status: 'deleted',
                };
                await this.saveLog({ model, user });

                return {
                    status: review ? true : false,
                };
            });
        } catch (err) {
            this.saveError({});
            console.log(err);
            return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }
    }

    async saveRecommendation(data: any, user: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                const project_pk = data?.project_pk;

                if (project_pk) {
                    const exists = await ProjectRecommendation.findOneBy({
                        project_pk: data.project_pk,
                        type: data.type,
                    });

                    let newRecommendation = null;
                    if (exists) {
                        newRecommendation = await EntityManager.update(
                            ProjectRecommendation,
                            { project_pk: data.project_pk, type: data.type },
                            { recommendation: data.recommendation },
                        );
                    } else {
                        const recommendation = new ProjectRecommendation();
                        recommendation.project_pk = data.project_pk;
                        recommendation.recommendation = data.recommendation;
                        recommendation.type = data.type;
                        recommendation.created_by = user.pk;
                        newRecommendation = await dataSource.manager.save(recommendation);
                    }

                    if (newRecommendation) {
                        let project = await Project.findOneBy({
                            pk: data.project_pk,
                        });

                        if (project.status == 'Initial Submission' &&
                            data.recommendation == 'Approved for Next Stage'
                        ) {
                            project.status = 'Contract Preparation';
                            project.save();
                        } else if (
                            project.status == 'Contract Preparation' &&
                            data.recommendation == 'Approved for Next Stage'
                        ) {
                            project.status = 'Final Approval';
                            project.save();
                        } else if (
                            project.status == 'Final Approval' &&
                            data.recommendation == 'Approved for Next Stage'
                        ) {
                            project.status = 'Partner Signing';
                            project.save();
                        } else if (
                            project.status == 'Partner Signing' &&
                            data.recommendation == 'Approved for Next Stage'
                        ) {
                            project.status = 'Closed';
                            project.save();
                        }
                    }

                    // save logs
                    const model = {
                        pk: data.project_pk,
                        name: 'project_recommendations',
                        recommendation: data.recommendation,
                        type: data.type,
                        status: exists ? 'update' : 'insert',
                    };
                    await this.saveLog({ model, user });

                    return {
                        status: newRecommendation ? true : false,
                        data: newRecommendation,
                    };
                } else {
                    return {
                        status: false,
                        code: 500,
                        message: 'Document/Project not found',
                    };
                }
            });
        } catch (err) {
            this.saveError({});
            console.log(err);
            return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }
    }
}
