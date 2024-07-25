import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
import { ProjectFunding } from './entities/project-funding.entity';
import { User } from 'src/user/entities/user.entity';
import { getParsedPk } from '../utilities/get-parsed-pk.utils';
import { Equal } from 'typeorm';
import { getDefaultValue } from '../utilities/get-default-value.utils';
import { ProjectFundingReport } from './entities/project-funding-report.entity';
import { ProjectFundingLiquidation } from './entities/project-funding-liquidation.entity';
import { ProjectSite } from './entities/project-site.entity';
import { ProjectEvent } from './entities/project-event.entity';
import { ProjectEventAttendee } from './entities/project-event-attendees.entity';
import { ProjectObjectiveResult } from './entities/project-objective-result.entity';
import { ProjectOutput } from './entities/project-output.entity';
import { ProjectBeneficiary } from './entities/project-beneficiary.entity';
import { ProjectCapDev } from './entities/project-capdev.entity';
import { ProjectCapDevSkill } from './entities/project-capdev-skill.entity';
import { ProjectCapDevObserve } from './entities/project-capdev-observe.entity';
import { ProjectLesson } from './entities/project-lesson.entity';
import { ProjectLink } from './entities/project-link.entity';
import { ProjectLocation } from './entities/project-location.entity';
import { Donor } from 'src/donor/entities/donor.entity';
import { AvailableProjectStatus } from 'src/utilities/constants';
import { PartnerAssessment } from 'src/partner/entities/partner-assessment.entity';
import { ProjectAssessment } from './entities/project-assessment.entity';

@Injectable()
export class ProjectsService extends GlobalService {
    constructor(
        @InjectRepository(Project)
        private emailService: EmailService,
    ) {
        super();
    }

    async findAll(filter: {
        overall_grant_status?: string;
        donors?: number[];
        country_pk?: number;
        province_code?: number;
        title?: string;
        type_pk?: string;
        date_from?: string;
        date_to?: string;
    }) {
        try {
            const data = await dataSource
                .getRepository(Project)
                .createQueryBuilder('projects')
                .leftJoinAndSelect('projects.project_location', 'project_location')
                .leftJoinAndSelect('project_location.country', 'countries')
                .leftJoinAndSelect('projects.project_proposal', 'project_proposals')
                .leftJoinAndSelect('project_proposals.project_proposal_activity', 'project_proposal_activity')
                .leftJoinAndSelect('projects.type', 'types')
                .leftJoinAndSelect('projects.project_assessment', 'project_assessments')
                .leftJoinAndSelect('project_assessments.donor', 'donors as assessment_donor')
                .leftJoinAndSelect('project_assessments.user', 'users')
                .leftJoinAndSelect('projects.project_funding', 'project_fundings')
                // .leftJoinAndSelect('project_fundings.donor', 'donors')
                // .leftJoinAndSelect('project_fundings.project_funding_report', 'project_funding_reports')
                // .leftJoinAndSelect('project_fundings.bank_receipt_document', 'documents')
                .leftJoinAndSelect('projects.application', 'applications')
                .where('projects.archived = false')
                .andWhere(filter.hasOwnProperty('donors') ? 'project_fundings.donor_pk IN (:...pk)' : '1=1', {
                    pk: filter.donors && Array.isArray(filter.donors) ? filter.donors : [filter.donors],
                })
                .andWhere(
                    filter.hasOwnProperty('overall_grant_status') ? 'projects.overall_grant_status = :status' : '1=1',
                    {
                        status: filter.overall_grant_status,
                    },
                )
                .andWhere(filter.hasOwnProperty('country_pk') ? 'project_location.country_pk = :country_pk' : '1=1', {
                    country_pk: filter?.country_pk,
                })
                .andWhere(
                    filter.hasOwnProperty('province_code') ? 'project_location.province_code = :province_code' : '1=1',
                    {
                        province_code: filter?.province_code,
                    },
                )
                .andWhere(filter.hasOwnProperty('type_pk') ? 'types.pk = :type_pk' : '1=1', {
                    type_pk: filter?.type_pk,
                })
                .andWhere(filter.hasOwnProperty('title') ? 'projects.title ILIKE :title' : '1=1', {
                    title: `%${filter?.title}%`,
                })
                .andWhere(
                    filter.hasOwnProperty('date_from') ? "to_char(projects.date_created, 'YYYY-MM') >= :from" : '1=1',
                    { from: filter?.date_from },
                )
                .andWhere(
                    filter.hasOwnProperty('date_to') ? "to_char(projects.date_created, 'YYYY-MM') <= :to" : '1=1',
                    { to: filter?.date_to },
                )
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
                .leftJoinAndSelect('projects.project_proposal', 'project_proposals')
                .leftJoinAndSelect('project_proposals.project_proposal_activity', 'project_proposal_activity')
                .leftJoinAndSelect('projects.type', 'types')
                .leftJoinAndSelect('projects.project_assessment', 'project_assessments')
                .leftJoinAndSelect('projects.project_funding', 'project_fundings')
                .leftJoinAndSelect('project_fundings.donor', 'donors')
                .leftJoinAndSelect('project_fundings.project_funding_report', 'project_funding_reports')
                .leftJoinAndSelect('project_assessments.donor', 'donors as assessment_donors')
                .leftJoinAndSelect('project_assessments.user', 'users')
                .andWhere(filter.hasOwnProperty('pk') ? 'projects.pk = :pk' : '1=1', { pk: filter.pk })
                .andWhere('projects.archived = :archived', { archived: false })
                .getOne();

            if (data) {
                const singleEntryProjectBeneficiary = (await this.getProjectBeneficiary(data?.pk)) ?? null;
                data['project_beneficiary'] = singleEntryProjectBeneficiary;
            }

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
                .where('partners.pk IN (:...pk)', { pk: pks })
                .getMany();
        } catch (error) {
            console.log(error);
            // SAVE ERROR
            return {
                status: false,
            };
        }
    }

    async updateProjectDetails(
        data: { pk?: number; application_pk?: number; partner_pk?: number; objective?: string; duration?: string },
        user: Partial<User>,
    ) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                const projectPk = data?.pk;
                const applicationPk = data?.application_pk;
                const newPartnerPk = data?.partner_pk;

                if (!projectPk || !newPartnerPk || !applicationPk) {
                    throw new Error(`missing fields project pk or partner_pk or applicationPk`);
                }

                await EntityManager.update(
                    Project,
                    {
                        pk: projectPk,
                    },
                    {
                        partner_pk: newPartnerPk,
                        objective: data?.objective,
                        duration: data?.duration,
                    },
                );

                await EntityManager.update(
                    Application,
                    {
                        pk: applicationPk,
                    },
                    {
                        partner_pk: newPartnerPk,
                    },
                );

                // save logs
                const model = {
                    pk: projectPk,
                    name: 'project',
                    status: 'updated',
                };

                await this.saveLog({
                    model,
                    user: {
                        pk: user?.pk,
                    },
                });
                return {
                    status: true,
                };
            });
        } catch (err) {
            this.saveError({});
            console.log(err);
            return { status: false, code: err?.code };
        } finally {
            await queryRunner.release();
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
                .where('partner_organizations.partner_pk IN (:...pk)', { pk: pks })
                .getMany();
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
                .where('partner_contacts.partner_pk IN (:...pk)', { pk: pks })
                .getMany();
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
                .leftJoinAndSelect(
                    'partner_fiscal_sponsors.documents',
                    'documents as partner_fiscal_sponsors_documents',
                )
                .where('partner_fiscal_sponsors.partner_pk IN (:...pk)', { pk: pks })
                .getMany();
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
                .leftJoinAndSelect(
                    'partner_nonprofit_equivalency_determinations.documents',
                    'documents as partner_nonprofit_equivalency_determinations_documents',
                )
                .where('partner_nonprofit_equivalency_determinations.partner_pk IN (:...pk)', { pk: pks })
                .getMany();
        } catch (error) {
            console.log(error);
            // SAVE ERROR
            return {
                status: false,
            };
        }
    }

    async getPartnerAssessments(pks: any) {
        try {
            return await dataSource
                .getRepository(PartnerAssessment)
                .createQueryBuilder('partner_assessments')
                .select('partner_assessments')
                .leftJoinAndSelect('partner_assessments.user', 'users')
                .where('partner_assessments.partner_pk IN (:...pk)', { pk: pks })
                .getMany();
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
                .where('projects.pk IN (:...pk)', { pk: pks })
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

    async getProjectFunding(filters: { project_pk?: number }) {
        try {
            const data = await this.queryProjectFunding([filters?.project_pk]);
            return {
                status: true,
                data: {
                    project_funding: data,
                },
            };
        } catch (error) {
            console.log(error);
            // SAVE ERROR
            return {
                status: false,
            };
        }
    }

    async queryProjectFunding(project_pks: any) {
        try {
            return await dataSource
                .getRepository(ProjectFunding)
                .createQueryBuilder('project_fundings')
                .select('project_fundings')
                .leftJoinAndSelect('project_fundings.donor', 'donors')
                .leftJoinAndSelect('project_fundings.bank_receipt_document', 'documents')

                // .leftJoinAndSelect('projects.project_funding', 'project_fundings')
                // .leftJoinAndSelect('project_fundings.donor', 'donors')
                // .leftJoinAndSelect('project_fundings.project_funding_report', 'project_funding_reports')
                // .leftJoinAndSelect('project_fundings.bank_receipt_document', 'documents')

                .leftJoinAndMapMany(
                    'project_fundings.project_funding_report',
                    ProjectFundingReport,
                    'project_funding_reports',
                    'project_funding_reports.project_funding_pk=project_fundings.pk',
                )
                .leftJoinAndMapOne(
                    'project_funding_reports.document',
                    Document,
                    'report_document',
                    'report_document.pk=project_funding_reports.attachment_pk',
                )
                .leftJoinAndMapMany(
                    'project_fundings.project_funding_liquidation',
                    ProjectFundingLiquidation,
                    'project_funding_liquidations',
                    'project_funding_liquidations.project_funding_pk=project_fundings.pk',
                )
                .leftJoinAndSelect('project_funding_liquidations.documents', 'documents as liquidation_documents')
                .andWhere('project_funding_reports.archived = false')
                .where('project_fundings.project_pk IN (:...project_pks)', { project_pks: project_pks })
                .orderBy('project_funding_reports.date_created', 'ASC')
                .orderBy('project_fundings.date_created', 'ASC')
                .getMany();
        } catch (error) {
            console.log(error);
            // SAVE ERROR
            return {
                status: false,
            };
        }
    }

    async getProjectBeneficiary(projectPk: number) {
        try {
            return await dataSource
                .getRepository(ProjectBeneficiary)
                .createQueryBuilder('project_beneficiaries')
                .select('project_beneficiaries')
                .where('project_beneficiaries.project_pk=:projectPk', { projectPk: projectPk })
                .orderBy('project_beneficiaries.date_created', 'ASC')
                .getOne();
        } catch (error) {
            console.log(error);
            // SAVE ERROR
            return null;
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

    async saveProjectFundingLiquidationAttachments(data: any, user: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                const liquidation_pk = data?.liquidation_pk;

                if (liquidation_pk && data.file.pk) {
                    const document = await EntityManager.query(
                        'insert into document_project_funding_liquidation_relation (document_pk, project_funding_liquidation_pk) values ($1 ,$2) ON CONFLICT DO NOTHING;',
                        [data.file.pk, liquidation_pk],
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

                        if (
                            (project.status == '' || project.status == 'Initial Submission') &&
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
                            project.status = 'Fund Release';
                            project.save();
                        } else if (
                            project.status == 'Fund Release' &&
                            data.recommendation == 'Approved for Next Stage'
                        ) {
                            project.status = 'Completed';
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

    async saveProjectFunding(
        data: Partial<
            ProjectFunding & {
                project_funding_report: Partial<ProjectFundingReport>[];
            }
        >,
        user: User,
    ) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            const savedProjectFunding = await queryRunner.manager.transaction(async (EntityManager) => {
                const projectFundingPk = getParsedPk(data?.pk);
                const projectPk = getParsedPk(data?.project_pk);
                const existingProjectFunding = await EntityManager.findOne(ProjectFunding, {
                    where: {
                        pk: Equal(projectFundingPk),
                        project_pk: Equal(projectPk),
                    },
                });

                const projectFunding = existingProjectFunding ? existingProjectFunding : new ProjectFunding();
                projectFunding.created_by = user?.pk;
                projectFunding.project_pk = projectPk;

                projectFunding.title = getDefaultValue(data?.title, existingProjectFunding?.title);
                projectFunding.donor_pk = getDefaultValue(data?.donor_pk, existingProjectFunding?.donor_pk);
                projectFunding.released_amount_usd = getDefaultValue(
                    data?.released_amount_usd,
                    existingProjectFunding?.released_amount_usd,
                );
                projectFunding.released_amount_other = getDefaultValue(
                    data?.released_amount_other,
                    existingProjectFunding?.released_amount_other,
                );
                projectFunding.released_amount_other_currency = getDefaultValue(
                    data?.released_amount_other_currency,
                    existingProjectFunding?.released_amount_other_currency,
                );

                projectFunding.released_date = getDefaultValue(
                    data?.released_date,
                    existingProjectFunding?.released_date,
                );
                projectFunding.report_due_date = getDefaultValue(
                    data?.report_due_date,
                    existingProjectFunding?.report_due_date,
                );

                projectFunding.grantee_acknowledgement = getDefaultValue(
                    data?.grantee_acknowledgement,
                    existingProjectFunding?.grantee_acknowledgement,
                );

                // 1 bank_receipt_pk is not updating if value is null
                projectFunding.bank_receipt_pk = getDefaultValue(
                    data?.bank_receipt_pk,
                    existingProjectFunding?.bank_receipt_pk,
                );

                if (data?.grantee_acknowledgement) {
                    projectFunding.grantee_acknowledgement = getDefaultValue(
                        data?.grantee_acknowledgement,
                        existingProjectFunding?.grantee_acknowledgement,
                    );
                } else {
                    projectFunding.grantee_acknowledgement = null;
                }

                const donor = await EntityManager.findOne(Donor, {
                    where: {
                        pk: Equal(data?.donor_pk),
                    },
                });

                const savedProjectFunding = await EntityManager.save(ProjectFunding, {
                    ...projectFunding,
                    donor: donor,
                });

                // 2 bank_receipt_pk is not updating if value is null
                await EntityManager.update(
                    ProjectFunding,
                    { pk: data?.pk },
                    { bank_receipt_pk: data?.bank_receipt_pk },
                );

                return savedProjectFunding;
            });
            const projectFundingPk = savedProjectFunding?.pk;
            let savedProjectFundingReports = [];

            const projectFundingReports = data?.project_funding_report ?? [];
            const resProjectFundingReports = await this.saveProjectFundingReport({
                project_funding_pk: projectFundingPk,
                project_funding_report: projectFundingReports,
            });

            savedProjectFundingReports = resProjectFundingReports?.data?.project_funding_report;

            return {
                status: true,
                data: {
                    ...savedProjectFunding,
                    project_funding_report: savedProjectFundingReports,
                },
            };
        } catch (err) {
            this.saveError({});
            console.log(err);
            return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }
    }

    async saveProjectFundingReport(
        data: Partial<{
            project_funding_pk: number;
            project_funding_report: Partial<ProjectFundingReport>[];
        }>,
    ) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            const savedProjectFundingReport = await queryRunner.manager.transaction(async (EntityManager) => {
                const projectFundingPk = getParsedPk(data?.project_funding_pk);
                const projectFundingReport = data?.project_funding_report ?? [];

                const tmpProjectFundingReport = projectFundingReport?.map(async (item) => {
                    const projectFundingReportPk = getParsedPk(item?.pk);
                    const existingProjectFundingReport = await EntityManager.findOne(ProjectFundingReport, {
                        where: {
                            pk: Equal(projectFundingReportPk),
                            project_funding_pk: Equal(projectFundingPk),
                        },
                    });

                    const projectFundingReport = existingProjectFundingReport
                        ? existingProjectFundingReport
                        : new ProjectFundingReport();
                    projectFundingReport.project_funding_pk = projectFundingPk;
                    projectFundingReport.title = getDefaultValue(item?.title, existingProjectFundingReport?.title);
                    projectFundingReport.status = getDefaultValue(item?.status, existingProjectFundingReport?.status);
                    projectFundingReport.attachment_pk = getDefaultValue(
                        item?.attachment_pk,
                        existingProjectFundingReport?.attachment_pk,
                    );

                    const savedItem = await EntityManager.save(ProjectFundingReport, {
                        ...projectFundingReport,
                    });

                    return {
                        ...savedItem,
                    };
                });

                await Promise.all(tmpProjectFundingReport);

                const savedProjectFundingReport =
                    (await EntityManager.findBy(ProjectFundingReport, {
                        project_funding_pk: Equal(projectFundingPk),
                    })) ?? [];

                const allItems = [...savedProjectFundingReport];

                return allItems;
            });

            return {
                status: true,
                data: {
                    project_funding_report: savedProjectFundingReport,
                },
            };
        } catch (err) {
            this.saveError({});
            console.log(err);
            return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }
    }

    async saveProjectFundingLiquidation(data: Partial<ProjectFundingLiquidation>) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            const savedProjectFundingLiquidation = await queryRunner.manager.transaction(async (EntityManager) => {
                const projectFundingLiquidationPk = getParsedPk(data?.pk);
                const projectFundingPk = getParsedPk(data?.project_funding_pk);

                const existingProjectFundingLiquidation = await EntityManager.findOne(ProjectFundingLiquidation, {
                    where: {
                        pk: Equal(projectFundingLiquidationPk),
                        project_funding_pk: Equal(projectFundingPk),
                    },
                });

                const projectFundingLiquidation = existingProjectFundingLiquidation
                    ? existingProjectFundingLiquidation
                    : new ProjectFundingLiquidation();

                projectFundingLiquidation.project_funding_pk = projectFundingPk;

                projectFundingLiquidation.status = getDefaultValue(
                    data?.status,
                    existingProjectFundingLiquidation?.status,
                );
                projectFundingLiquidation.description = getDefaultValue(
                    data?.description,
                    existingProjectFundingLiquidation?.description,
                );
                projectFundingLiquidation.amount_usd = getDefaultValue(
                    data?.amount_usd,
                    existingProjectFundingLiquidation?.amount_usd,
                );
                projectFundingLiquidation.amount_other = getDefaultValue(
                    data?.amount_other,
                    existingProjectFundingLiquidation?.amount_other,
                );
                projectFundingLiquidation.amount_other_currency = getDefaultValue(
                    data?.amount_other_currency,
                    existingProjectFundingLiquidation?.amount_other_currency,
                );
                projectFundingLiquidation.date_released = getDefaultValue(
                    data?.date_released,
                    existingProjectFundingLiquidation?.date_released,
                );
                const savedItem = await EntityManager.save(ProjectFundingLiquidation, {
                    ...projectFundingLiquidation,
                });

                return {
                    ...savedItem,
                };
            });

            return {
                status: true,
                data: {
                    ...savedProjectFundingLiquidation,
                },
            };
        } catch (err) {
            this.saveError({});
            console.log(err);
            return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }
    }

    async deleteProjectFundingReport(
        data: {
            project_pk: number;
            project_funding_pk: number;
            project_funding_report_pk: number;
        },
        user: any,
    ) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                const projectFundingReportPk = getParsedPk(+data?.project_funding_report_pk);
                const report = await EntityManager.findOneBy(ProjectFundingReport, {
                    pk: Equal(projectFundingReportPk),
                });

                await report.remove();

                // save logs
                const model = {
                    pk: projectFundingReportPk,
                    name: 'project_funding_report',
                    status: 'deleted',
                };
                await this.saveLog({ model, user });

                return { status: true };
            });
        } catch (err) {
            console.log(err);
            this.saveError({});
            return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }
    }

    async getProjectSite(filter: { projectPks: number[] }) {
        try {
            const data = await dataSource
                .getRepository(ProjectSite)
                .createQueryBuilder('project_sites')
                .select('project_sites')
                .where('project_sites.project_pk IN (:...project_pk)', { project_pk: filter.projectPks })
                .orderBy('project_sites.date_created', 'ASC')
                .getMany();
            return {
                status: true,
                data,
            };
        } catch (error) {
            console.log(error);
            // SAVE ERROR
            return {
                status: false,
            };
        }
    }

    async saveProjectSite(
        data: {
            project_pk: number;
            project_site: Partial<ProjectSite>[];
        },
        user: Partial<User>,
    ) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            const savedProjectSites = await queryRunner.manager.transaction(async (EntityManager) => {
                const projectPk = getParsedPk(data?.project_pk);
                const projectSites = data?.project_site ?? [];

                const tmpProjectSite = projectSites?.map(async (item) => {
                    const projectSitePk = getParsedPk(item?.pk);
                    const existingProjectSite = await EntityManager.findOne(ProjectSite, {
                        where: {
                            pk: Equal(projectSitePk),
                            project_pk: Equal(projectPk),
                        },
                    });

                    const projectSite = existingProjectSite ? existingProjectSite : new ProjectSite();
                    projectSite.project_pk = projectPk;
                    projectSite.site = getDefaultValue(item?.site, existingProjectSite?.site);
                    projectSite.created_by = user?.pk;

                    const savedItem = await EntityManager.save(ProjectSite, {
                        ...projectSite,
                    });

                    return {
                        ...savedItem,
                    };
                });

                await Promise.all(tmpProjectSite);

                const savedProjectSite =
                    (await EntityManager.findBy(ProjectSite, {
                        project_pk: Equal(projectPk),
                    })) ?? [];

                const allItems = [...savedProjectSite];

                return allItems;
            });

            return {
                status: true,
                data: {
                    project_site: savedProjectSites,
                },
            };
        } catch (err) {
            this.saveError({});
            console.log(err);
            return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }
    }

    async deleteProjectSite(
        data: {
            project_pk: number;
            project_site_pk: number;
        },
        user: any,
    ) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                const projectSitePk = getParsedPk(+data?.project_site_pk);
                const site = await EntityManager.findOneBy(ProjectSite, {
                    pk: Equal(projectSitePk),
                });

                await site.remove();

                // save logs
                const model = {
                    pk: projectSitePk,
                    name: 'project_site',
                    status: 'deleted',
                };
                await this.saveLog({ model, user });

                return { status: true };
            });
        } catch (err) {
            console.log(err);
            this.saveError({});
            return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }
    }

    async updateFinancialManagementTraining(data: any, user: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                await EntityManager.update(
                    Project,
                    { pk: data.project_pk },
                    { financial_management_training: data.financial_management_training },
                );

                // save logs
                const model = {
                    pk: data.project_pk,
                    name: 'projects',
                    financial_management_training: data.financial_management_training,
                    status: 'update',
                };
                await this.saveLog({ model, user });

                return { status: true };
            });
        } catch (err) {
            this.saveError({});
            console.log(err);
            return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }
    }

    async getEvents(pk, user: any) {
        try {
            return await dataSource
                .getRepository(ProjectEvent)
                .createQueryBuilder('project_events')
                .andWhere('project_pk = :pk', { pk })
                .andWhere('archived = false')
                .orderBy('pk')
                .getMany();
        } catch (error) {
            console.log(error);
            // SAVE ERROR
            return {
                status: false,
            };
        }
    }

    async getAttendees(pks) {
        try {
            return await dataSource
                .getRepository(ProjectEventAttendee)
                .createQueryBuilder('project_event_attendees')
                .andWhere('project_event_pk IN (:...pk)', { pk: pks })
                .andWhere('archived = false')
                .getMany();
        } catch (error) {
            console.log(error);
            // SAVE ERROR
            return {
                status: false,
            };
        }
    }

    async saveEvent(project_pk: number, event: any, user: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                const existing = event.pk
                    ? await EntityManager.findOne(ProjectEvent, { where: { pk: event.pk } })
                    : null;
                const output = existing ? existing : new ProjectEvent();

                output.name = event.name;
                output.project_pk = event.project_pk;
                output.created_by = existing ? event.created_by : user.pk;
                await dataSource.manager.save(output);

                return { status: output ? true : false, data: output };
            });
        } catch (err) {
            this.saveError({});
            console.log(err);
            return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }
    }

    async saveAttendee(project_pk: number, event_pk: number, data: any, user: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                let attendee = null;
                if (data.pk) {
                    attendee = await EntityManager.update(ProjectEventAttendee, { pk: data.pk }, data);
                } else {
                    delete data.pk;
                    let attendee = data;
                    attendee.created_by = user ? user.pk : null;
                    attendee.archived = attendee.archived ?? false;
                    attendee = await EntityManager.insert(ProjectEventAttendee, attendee);
                }

                return { status: attendee ? true : false };
            });
        } catch (err) {
            this.saveError({});
            console.log(err);
            throw new InternalServerErrorException();
            // return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }
    }

    async destroyAttendee(pk: number, user: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                await EntityManager.update(ProjectEventAttendee, { pk: pk }, { archived: true });
            });
        } catch (err) {
            this.saveError({});
            console.log(err);
            return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }
    }

    async destroyEvent(project_pk: number, pk: number, user: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                console.log(project_pk, pk);
                await EntityManager.update(ProjectEvent, { pk, project_pk }, { archived: true });
            });
        } catch (err) {
            this.saveError({});
            console.log(err);
            return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }
    }

    async getProjectObjectiveResults(pk, user: any) {
        try {
            const data = await dataSource
                .getRepository(ProjectObjectiveResult)
                .createQueryBuilder('project_objective_results')
                .andWhere('project_pk = :pk', { pk })
                .andWhere('archived = false')
                .orderBy('pk', 'ASC')
                .getManyAndCount();

            return {
                status: true,
                data: data[0],
                total: data[1],
            };
        } catch (error) {
            console.log(error);
            // SAVE ERROR
            return {
                status: false,
            };
        }
    }

    async getProjectOutput(pk, user: any) {
        try {
            return await dataSource
                .getRepository(ProjectOutput)
                .createQueryBuilder('project_outputs')
                .andWhere('project_pk = :pk', { pk })
                .andWhere('archived = false')
                .orderBy('pk', 'ASC')
                .getOne();
        } catch (error) {
            console.log(error);
            // SAVE ERROR
            return {
                status: false,
            };
        }
    }

    async saveProjectObjectiveResult(project_pk: number, data: any, user: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                let objective_result = null;
                if (data.pk) {
                    delete data.editable;
                    objective_result = await EntityManager.update(ProjectObjectiveResult, { pk: data.pk }, data);
                } else {
                    objective_result = data;
                    objective_result.created_by = user.pk;
                    objective_result.archived = objective_result.archived ?? false;
                    objective_result = await EntityManager.insert(ProjectObjectiveResult, objective_result);
                }

                return { status: objective_result ? true : false, data: objective_result };
            });
        } catch (err) {
            this.saveError({});
            console.log(err);
            return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }
    }

    async saveProjectOutput(project_pk: number, data: any, user: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                data.project_pk = project_pk;
                const existing = await EntityManager.findOne(ProjectOutput, {
                    where: { project_pk },
                });

                const output = existing ? existing : new ProjectOutput();
                output.project_pk = parseInt(data.project_pk);
                output.tenure_security = data.tenure_security;
                output.tenure_security_form = data.tenure_security_form;
                output.territory = data.territory;
                output.hectares = data.hectares == '' ? 0 : data.hectares;
                output.livelihood = data.livelihood;
                output.individual_income = data.individual_income;
                output.household_income = data.household_income;
                output.individual = data.individual;
                output.household = data.household;
                output.disability_rights = data.disability_rights == 'yes' ? true : false;
                output.intervention_type = data.intervention_type;
                output.created_by = user.pk;

                const saved = await EntityManager.save(ProjectOutput, {
                    ...output,
                });

                return {
                    status: saved ? true : false,
                    data: saved,
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

    async getProjectBeneficiaries(filter: { project_pk: number }) {
        try {
            const projBeneficiaries = await dataSource
                .getRepository(ProjectBeneficiary)
                .createQueryBuilder('project_beneficiaries')
                .select('project_beneficiaries')
                .where('project_beneficiaries.project_pk=:project_pk', { project_pk: filter?.project_pk })
                .orderBy('project_beneficiaries.date_created', 'ASC')
                .getManyAndCount();

            return {
                status: true,
                data: projBeneficiaries[0],
                total: projBeneficiaries[1],
            };
        } catch (error) {
            console.log(error);
            return {
                status: false,
                code: 500,
            };
        }
    }

    async saveProjectBeneficiary(data: Partial<ProjectBeneficiary>) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            const savedProjBeneficiary = await queryRunner.manager.transaction(async (EntityManager) => {
                const projectPk = getParsedPk(data?.project_pk);
                const projBeneficiaryPk = getParsedPk(data?.pk);
                const existingProjBeneficiary = await EntityManager.findOne(ProjectBeneficiary, {
                    where: {
                        pk: Equal(projBeneficiaryPk),
                        project_pk: Equal(projectPk),
                    },
                });
                const beneficiary = existingProjBeneficiary ? existingProjBeneficiary : new ProjectBeneficiary();
                beneficiary.project_pk = projectPk;
                beneficiary.women_count = getDefaultValue(data?.women_count, existingProjBeneficiary?.women_count);
                beneficiary.women_diffable_count = getDefaultValue(
                    data?.women_diffable_count,
                    existingProjBeneficiary?.women_diffable_count,
                );
                beneficiary.women_other_vulnerable_sector_count = getDefaultValue(
                    data?.women_other_vulnerable_sector_count,
                    existingProjBeneficiary?.women_other_vulnerable_sector_count,
                );

                beneficiary.young_women_count = getDefaultValue(
                    data?.young_women_count,
                    existingProjBeneficiary?.young_women_count,
                );
                beneficiary.young_women_diffable_count = getDefaultValue(
                    data?.young_women_diffable_count,
                    existingProjBeneficiary?.young_women_diffable_count,
                );
                beneficiary.young_women_other_vulnerable_sector_count = getDefaultValue(
                    data?.young_women_other_vulnerable_sector_count,
                    existingProjBeneficiary?.young_women_other_vulnerable_sector_count,
                );

                beneficiary.men_count = getDefaultValue(data?.men_count, existingProjBeneficiary?.men_count);
                beneficiary.men_diffable_count = getDefaultValue(
                    data?.men_diffable_count,
                    existingProjBeneficiary?.men_diffable_count,
                );
                beneficiary.men_other_vulnerable_sector_count = getDefaultValue(
                    data?.men_other_vulnerable_sector_count,
                    existingProjBeneficiary?.men_other_vulnerable_sector_count,
                );

                beneficiary.young_men_count = getDefaultValue(
                    data?.young_men_count,
                    existingProjBeneficiary?.young_men_count,
                );
                beneficiary.young_men_diffable_count = getDefaultValue(
                    data?.young_men_diffable_count,
                    existingProjBeneficiary?.young_men_diffable_count,
                );
                beneficiary.young_men_other_vulnerable_sector_count = getDefaultValue(
                    data?.young_men_other_vulnerable_sector_count,
                    existingProjBeneficiary?.young_men_other_vulnerable_sector_count,
                );

                const savedItem = await EntityManager.save(ProjectBeneficiary, {
                    ...beneficiary,
                });

                return {
                    ...savedItem,
                };
            });

            return {
                status: true,
                data: {
                    ...savedProjBeneficiary,
                },
            };
        } catch (err) {
            this.saveError({});
            console.log(err);
            return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }
    }

    async deleteProjectBeneficiary(
        data: {
            pk: number;
        },
        user: any,
    ) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                const projectBeneficiaryPk = getParsedPk(+data?.pk);
                const projectBeneficiary = await EntityManager.findOneBy(ProjectBeneficiary, {
                    pk: Equal(projectBeneficiaryPk),
                });

                await projectBeneficiary.remove();

                // save logs
                const model = {
                    pk: projectBeneficiaryPk,
                    name: 'project_beneficiary',
                    status: 'deleted',
                };
                await this.saveLog({ model, user });

                return { status: true };
            });
        } catch (err) {
            console.log(err);
            this.saveError({});
            return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }
    }

    async getProjectCapDevKnowledge(filter: { project_pk: number }) {
        try {
            const projectCapDevKnowledge = await dataSource
                .getRepository(ProjectCapDev)
                .createQueryBuilder('project_capdevs')
                .select('project_capdevs')
                .where('project_capdevs.project_pk=:project_pk', { project_pk: filter?.project_pk })
                .orderBy('project_capdevs.date_created', 'ASC')
                .andWhere('project_capdevs.archived = :archived', { archived: false })
                .getManyAndCount();

            return {
                status: true,
                data: projectCapDevKnowledge[0],
                total: projectCapDevKnowledge[1],
            };
        } catch (error) {
            console.log(error);
            return {
                status: false,
                code: 500,
            };
        }
    }

    async saveProjectCapDevKnowledge(data: Partial<ProjectCapDev>, user: Partial<User>) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            const savedProjCapDevKnowledge = await queryRunner.manager.transaction(async (EntityManager) => {
                const projectPk = getParsedPk(data?.project_pk);
                const projCapDevKnowledgePk = getParsedPk(data?.pk);
                const existingKnowledge = await EntityManager.findOne(ProjectCapDev, {
                    where: {
                        pk: Equal(projCapDevKnowledgePk),
                        project_pk: Equal(projectPk),
                    },
                });
                const capDevKnowledge = existingKnowledge ? existingKnowledge : new ProjectCapDev();
                capDevKnowledge.project_pk = projectPk;
                capDevKnowledge.created_by = user?.pk;
                capDevKnowledge.knowledge = getDefaultValue(data?.knowledge, existingKnowledge?.knowledge);
                capDevKnowledge.instruction = getDefaultValue(data?.instruction, existingKnowledge?.instruction);
                capDevKnowledge.remarks = getDefaultValue(data?.remarks, existingKnowledge?.remarks);

                const savedItem = await EntityManager.save(ProjectCapDev, {
                    ...capDevKnowledge,
                });

                return {
                    ...savedItem,
                };
            });

            return {
                status: true,
                data: {
                    ...savedProjCapDevKnowledge,
                },
            };
        } catch (err) {
            this.saveError({});
            console.log(err);
            return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }
    }

    async deleteProjectCapDevKnowledge(
        data: {
            project_pk: number;
            pk: number;
        },
        user: any,
    ) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                const projectCapDevKnowledgePk = getParsedPk(+data?.pk);
                const projectCapDevKnowledge = await EntityManager.findOneBy(ProjectCapDev, {
                    pk: Equal(projectCapDevKnowledgePk),
                });

                const savedItem = await EntityManager.save(ProjectCapDev, {
                    ...projectCapDevKnowledge,
                    archived: true,
                });

                // save logs
                const model = {
                    pk: savedItem?.pk,
                    name: 'project_capdev',
                    status: 'deleted',
                };
                await this.saveLog({ model, user });

                return { status: true };
            });
        } catch (err) {
            console.log(err);
            this.saveError({});
            return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }
    }

    async getProjectCapDevSkill(filter: { project_pk: number }) {
        try {
            const projectCapDevSkill = await dataSource
                .getRepository(ProjectCapDevSkill)
                .createQueryBuilder('project_capdev_skills')
                .select('project_capdev_skills')
                .where('project_capdev_skills.project_pk=:project_pk', { project_pk: filter?.project_pk })
                .orderBy('project_capdev_skills.date_created', 'ASC')
                .andWhere('project_capdev_skills.archived = :archived', { archived: false })
                .getManyAndCount();

            return {
                status: true,
                data: projectCapDevSkill[0],
                total: projectCapDevSkill[1],
            };
        } catch (error) {
            console.log(error);
            return {
                status: false,
                code: 500,
            };
        }
    }

    async saveProjectCapDevSkill(data: Partial<ProjectCapDevSkill>, user: Partial<User>) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            const savedProjCapDevSkill = await queryRunner.manager.transaction(async (EntityManager) => {
                const projectPk = getParsedPk(data?.project_pk);
                const projCapDevSkillPk = getParsedPk(data?.pk);
                const existingSkill = await EntityManager.findOne(ProjectCapDevSkill, {
                    where: {
                        pk: Equal(projCapDevSkillPk),
                        project_pk: Equal(projectPk),
                    },
                });
                const capDevSkill = existingSkill ? existingSkill : new ProjectCapDevSkill();
                capDevSkill.project_pk = projectPk;
                capDevSkill.created_by = user?.pk;
                capDevSkill.skill_gained = getDefaultValue(data?.skill_gained, existingSkill?.skill_gained);
                capDevSkill.skill = getDefaultValue(data?.skill, existingSkill?.skill);
                capDevSkill.instruction = getDefaultValue(data?.instruction, existingSkill?.instruction);
                capDevSkill.remarks = getDefaultValue(data?.remarks, existingSkill?.remarks);

                const savedItem = await EntityManager.save(ProjectCapDevSkill, {
                    ...capDevSkill,
                });

                return {
                    ...savedItem,
                };
            });

            return {
                status: true,
                data: {
                    ...savedProjCapDevSkill,
                },
            };
        } catch (err) {
            this.saveError({});
            console.log(err);
            return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }
    }

    async deleteProjectCapDevSkill(
        data: {
            project_pk: number;
            pk: number;
        },
        user: any,
    ) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                const projectCapDevSkillPk = getParsedPk(+data?.pk);
                const projectCapDevSkill = await EntityManager.findOneBy(ProjectCapDevSkill, {
                    pk: Equal(projectCapDevSkillPk),
                });

                const savedItem = await EntityManager.save(ProjectCapDevSkill, {
                    ...projectCapDevSkill,
                    archived: true,
                });

                // save logs
                const model = {
                    pk: savedItem?.pk,
                    name: 'project_capdev_skill',
                    status: 'deleted',
                };
                await this.saveLog({ model, user });

                return { status: true };
            });
        } catch (err) {
            console.log(err);
            this.saveError({});
            return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }
    }

    async getProjectCapDevObserve(filter: { project_pk: number }) {
        try {
            const projectCapDevObserve = await dataSource
                .getRepository(ProjectCapDevObserve)
                .createQueryBuilder('project_capdev_observes')
                .select('project_capdev_observes')
                .where('project_capdev_observes.project_pk=:project_pk', { project_pk: filter?.project_pk })
                .orderBy('project_capdev_observes.date_created', 'ASC')
                .andWhere('project_capdev_observes.archived = :archived', { archived: false })
                .getManyAndCount();

            return {
                status: true,
                data: projectCapDevObserve[0],
                total: projectCapDevObserve[1],
            };
        } catch (error) {
            console.log(error);
            return {
                status: false,
                code: 500,
            };
        }
    }

    async saveProjectCapDevObserve(data: Partial<ProjectCapDevObserve>, user: Partial<User>) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            const savedProjCapDevObserve = await queryRunner.manager.transaction(async (EntityManager) => {
                const projectPk = getParsedPk(data?.project_pk);
                const projCapDevObservePk = getParsedPk(data?.pk);
                const existingObserve = await EntityManager.findOne(ProjectCapDevObserve, {
                    where: {
                        pk: Equal(projCapDevObservePk),
                        project_pk: Equal(projectPk),
                    },
                });
                const capDevObserve = existingObserve ? existingObserve : new ProjectCapDevObserve();
                capDevObserve.project_pk = projectPk;
                capDevObserve.created_by = user?.pk;
                capDevObserve.observed = getDefaultValue(data?.observed, existingObserve?.observed);

                const savedItem = await EntityManager.save(ProjectCapDevObserve, {
                    ...capDevObserve,
                });

                return {
                    ...savedItem,
                };
            });

            return {
                status: true,
                data: {
                    ...savedProjCapDevObserve,
                },
            };
        } catch (err) {
            this.saveError({});
            console.log(err);
            return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }
    }

    async deleteProjectCapDevObserve(
        data: {
            project_pk: number;
            pk: number;
        },
        user: any,
    ) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                const projectCapDevObservePk = getParsedPk(+data?.pk);
                const projectCapDevObserve = await EntityManager.findOneBy(ProjectCapDevObserve, {
                    pk: Equal(projectCapDevObservePk),
                });

                const savedItem = await EntityManager.save(ProjectCapDevObserve, {
                    ...projectCapDevObserve,
                    archived: true,
                });

                // save logs
                const model = {
                    pk: savedItem?.pk,
                    name: 'project_capdev_observe',
                    status: 'deleted',
                };
                await this.saveLog({ model, user });

                return { status: true };
            });
        } catch (err) {
            console.log(err);
            this.saveError({});
            return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }
    }

    async getProjectLesson(filter: { project_pk: number; type?: string }) {
        try {
            const projLesson = await dataSource
                .getRepository(ProjectLesson)
                .createQueryBuilder('project_lessons')
                .select('project_lessons')
                .where('project_lessons.project_pk=:project_pk', { project_pk: filter?.project_pk })
                .andWhere(filter?.type ? 'project_lessons.type = :type' : '1=1', { type: filter?.type })
                .andWhere('project_lessons.archived = :archived', { archived: false })
                .orderBy('project_lessons.date_created', 'ASC')
                .getManyAndCount();

            return {
                status: true,
                data: projLesson[0],
                total: projLesson[1],
            };
        } catch (error) {
            console.log(error);
            return {
                status: false,
                code: 500,
            };
        }
    }

    async saveProjectLesson(data: Partial<ProjectLesson>, user: Partial<User>) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            const saveProjLesson = await queryRunner.manager.transaction(async (EntityManager) => {
                const projectPk = getParsedPk(data?.project_pk);
                const projLessonPk = getParsedPk(data?.pk);
                const existingLesson = await EntityManager.findOne(ProjectLesson, {
                    where: {
                        pk: Equal(projLessonPk),
                        project_pk: Equal(projectPk),
                    },
                });
                const lesson = existingLesson ? existingLesson : new ProjectLesson();
                lesson.project_pk = projectPk;
                lesson.created_by = user?.pk;
                lesson.type = getDefaultValue(data?.type, existingLesson?.type);
                lesson.type_content = getDefaultValue(data?.type_content, existingLesson?.type_content);
                lesson.description = getDefaultValue(data?.description, existingLesson?.description);

                const savedItem = await EntityManager.save(ProjectLesson, {
                    ...lesson,
                });

                return {
                    ...savedItem,
                };
            });

            return {
                status: true,
                data: {
                    ...saveProjLesson,
                },
            };
        } catch (err) {
            this.saveError({});
            console.log(err);
            return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }
    }

    async deleteProjectLesson(
        data: {
            project_pk: number;
            pk: number;
        },
        user: any,
    ) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                const projectLessonPk = getParsedPk(+data?.pk);
                const projectLesson = await EntityManager.findOneBy(ProjectLesson, {
                    pk: Equal(projectLessonPk),
                });

                const existingItem = await EntityManager.save(ProjectLesson, {
                    ...projectLesson,
                    archived: true,
                });

                // save logs
                const model = {
                    pk: existingItem?.pk,
                    name: 'project_lesson',
                    status: 'deleted',
                };
                await this.saveLog({ model, user });

                return { status: true };
            });
        } catch (err) {
            console.log(err);
            this.saveError({});
            return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }
    }

    async findDocuments(filters: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                // DANGER and documents.mime_type like '${filters.mimetype}%' is vulnerable to sql injection
                const data = await EntityManager.query(
                    `select
                            projects.pk as project_pk,
                            documents.*
                        from projects
                        left join document_project_relation on (projects.pk = document_project_relation.project_pk)
                        left join documents on (document_project_relation.document_pk = documents.pk)
                        where projects.pk = $1
                        and documents.type = 'documentation'
                        and documents.mime_type like '${filters.mimetype}%'
                        order by documents.pk desc
                        ;`,
                    [filters.project_pk],
                );

                return {
                    status: data ? true : false,
                    data: data,
                    total: data.length,
                };
            });
        } catch (err) {
            console.log(err);
            return {
                status: false,
                code: 500,
            };
        } finally {
            await queryRunner.release();
        }
    }

    async findLinks(filters: any) {
        const data = await dataSource.manager
            .getRepository(ProjectLink)
            .createQueryBuilder('project_links')
            .andWhere(filters.hasOwnProperty('archived') && filters.archived != '' ? 'archived = :archived' : '1=1', {
                archived: `${filters.archived}`,
            })
            .orderBy('pk', 'DESC')
            .skip(filters.skip)
            .take(filters.take)
            .getManyAndCount();
        return {
            status: true,
            data: data[0],
            total: data[1],
        };
    }

    async saveLink(pk: number, body: any, user: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            const saveProjLink = await queryRunner.manager.transaction(async (EntityManager) => {
                const link = new ProjectLink();
                link.project_pk = pk;
                link.link = body.link;
                link.created_by = user.pk;

                const savedItem = await EntityManager.save(ProjectLink, {
                    ...link,
                });

                return {
                    ...savedItem,
                };
            });

            return {
                status: true,
                data: {
                    ...saveProjLink,
                },
            };
        } catch (err) {
            this.saveError({});
            console.log(err);
            return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }
    }

    async findGroupProjectType() {
        try {
            const groupProjectType = await dataSource
                .getRepository(Project)
                .createQueryBuilder('projects')
                .select('projects.type_pk', 'type_pk')
                .addSelect('COUNT(projects.pk)', 'total')
                .groupBy('projects.type_pk')
                .andWhere('projects.archived = :archived', { archived: false })
                .getRawMany();

            return {
                status: true,
                data: groupProjectType ?? [],
            };
        } catch (error) {
            console.log(error);
            return {
                status: false,
                code: 500,
            };
        }
    }

    async findGroupProjectDateCreated(filter: { to_date?: string }) {
        try {
            const groupProjectDateCreated = await dataSource
                .getRepository(Project)
                .createQueryBuilder('projects')
                .select(`DATE_TRUNC('year',projects.date_created)`, `date_created`)
                .addSelect('COUNT(projects.pk)', 'total')
                .groupBy(`DATE_TRUNC('year',projects.date_created)`)
                .where('projects.archived = :archived', { archived: false })
                .andWhere(filter?.to_date ? `DATE_TRUNC('year',projects.date_created) <= :date` : `1=1`, {
                    date: filter?.to_date,
                })
                .getRawMany();

            return {
                status: true,
                data: groupProjectDateCreated ?? [],
            };
        } catch (error) {
            console.log(error);
            return {
                status: false,
                code: 500,
            };
        }
    }

    async findGroupProjectCountry(filter?: { closing_status?: string; is_applied?: boolean }) {
        try {
            const groupedProjectCountry = await dataSource
                .getRepository(ProjectLocation)
                .createQueryBuilder('project_locations')
                .select(['country_pk', 'countries.name AS country_name', 'countries.code AS country_code'])
                .addSelect('COUNT(project_locations.project_pk)', 'total')
                .leftJoin('countries', 'countries', 'countries.pk = project_locations.country_pk')
                .leftJoin('projects', 'projects', 'projects.pk = project_locations.project_pk')
                .groupBy('project_locations.country_pk, countries.name, countries.code')
                .andWhere(
                    filter?.hasOwnProperty('closing_status') && filter?.closing_status
                        ? 'projects.closing_status = :closing_status'
                        : '1=1',
                    {
                        closing_status: filter?.closing_status,
                    },
                )
                .andWhere(filter?.hasOwnProperty('is_applied') ? 'projects.status is not null' : '1=1')
                .getRawMany();

            return {
                status: true,
                data: groupedProjectCountry ?? [],
            };
        } catch (error) {
            console.log(error);
            return {
                status: false,
                code: 500,
            };
        }
    }

    async getTotalPerDonor() {
        try {
            return await dataSource
                .getRepository(Project)
                .createQueryBuilder('projects')
                .select('projects')
                .leftJoinAndSelect('projects.project_funding', 'project_fundings')
                .leftJoinAndSelect('project_fundings.donor', 'donors')
                .leftJoinAndSelect('project_fundings.bank_receipt_document', 'documents')
                .andWhere('projects.archived = false')
                .andWhere('projects.status IS NOT NULL')
                .getMany();
        } catch (error) {
            console.log(error);
            // SAVE ERROR
            return {
                status: false,
            };
        }
    }

    async findCountProjectStatus(status_option?: 'all' | AvailableProjectStatus, include_tranche?: boolean) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        const NOT_INCLUDED_STATUS = ['Fund Release', 'Completed'];
        try {
            let count = 0;
            if (!include_tranche) {
                count = await dataSource
                    .getRepository(Project)
                    .createQueryBuilder('projects')
                    .where(
                        status_option === 'all'
                            ? `projects.status IS NOT NULL AND projects.status NOT IN (:...NOT_INCLUDED_STATUS)`
                            : 'projects.status=:status_option',
                        {
                            status_option,
                            NOT_INCLUDED_STATUS,
                        },
                    )
                    .getCount();
            } else {
                count = await dataSource
                    .getRepository(ProjectFunding)
                    .createQueryBuilder('project_fundings')
                    .leftJoinAndMapMany(
                        'project_fundings.project',
                        Project,
                        'projects',
                        'projects.pk=project_fundings.project_pk',
                    )
                    .where('projects.status=:status', { status: 'Fund Release' })
                    .getCount();
            }

            return {
                status: true,
                data: {
                    status_option,
                    count,
                },
            };
        } catch (err) {
            console.log(err);
            this.saveError({});
            return {
                status: false,
                code: err?.code,
            };
        } finally {
            await queryRunner.release();
        }
    }

    async saveProjectOverallGrantStatus(project_pk: number, status: string, user: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                const project = EntityManager.update(Project, { pk: project_pk }, { overall_grant_status: status });

                // save logs
                const model = {
                    pk: project_pk,
                    name: 'overall_grant_status',
                    status: 'update',
                };
                await this.saveLog({ model, user });

                return { status: project ? true : false, data: project };
            });
        } catch (err) {
            this.saveError({});
            console.log(err);
            return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }
    }

    async saveProjectClosingStatus(project_pk: number, status: string, user: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                const project = EntityManager.update(Project, { pk: project_pk }, { closing_status: status });

                // save logs
                const model = {
                    pk: project_pk,
                    name: 'closing_status',
                    status: 'update',
                };
                await this.saveLog({ model, user });

                return { status: project ? true : false, data: project };
            });
        } catch (err) {
            this.saveError({});
            console.log(err);
            return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }
    }

    async saveProjectPendingDocument(project_pk: number, status: string, user: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                const project = EntityManager.update(Project, { pk: project_pk }, { pending_document: status });

                // save logs
                const model = {
                    pk: project_pk,
                    name: 'pending_document',
                    status: 'update',
                };
                await this.saveLog({ model, user });

                return { status: project ? true : false, data: project };
            });
        } catch (err) {
            this.saveError({});
            console.log(err);
            return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }
    }

    async fetchProjectTranches() {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            const data = await dataSource
                .getRepository(ProjectFunding)
                .createQueryBuilder('project_fundings')
                .leftJoinAndSelect('project_fundings.project', 'projects')
                .leftJoinAndSelect('projects.application', 'applications')
                .leftJoinAndSelect('applications.partner', 'partners')
                .leftJoinAndSelect('project_fundings.project_funding_report', 'project_funding_reports')
                .andWhere('projects.archived = false')
                .andWhere('applications.archived = false')
                .getManyAndCount();

            return {
                status: true,
                data: data[0],
                total: data[1],
            };
        } catch (err) {
            console.log(err);
            this.saveError({});
            return {
                status: false,
                code: err?.code,
            };
        } finally {
            await queryRunner.release();
        }
    }

    async saveAssessment(data: Partial<ProjectAssessment>, user: Partial<User>) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                const projectPk = getParsedPk(data?.project_pk);
                const partnerAssessmentPk = getParsedPk(data?.pk);
                const donorPk = getParsedPk(data?.donor_pk);
                const userPk = getParsedPk(user?.pk);
                const existingAssessment = await EntityManager.findOne(ProjectAssessment, {
                    where: {
                        pk: Equal(partnerAssessmentPk),
                        project_pk: Equal(projectPk),
                        created_by: Equal(userPk),
                    },
                });

                const assessment = existingAssessment ? existingAssessment : new ProjectAssessment();
                assessment.project_pk = projectPk;
                assessment.donor_pk = userPk;
                assessment.created_by = userPk;
                assessment.message = getDefaultValue(data?.message, existingAssessment?.message);

                const savedAssessment = await EntityManager.save(ProjectAssessment, {
                    ...assessment,
                });

                const model = {
                    name: 'project_assessments',
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

    async fetchProjectTitles(req: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                const data = await dataSource
                    .getRepository(Project)
                    .createQueryBuilder('projects')
                    .where('projects.archived = false')
                    .orderBy('projects.title', 'ASC')
                    .getMany();

                return {
                    status: true,
                    data: data,
                };
            });
        } catch (err) {
            console.log(err);
            return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }
    }

    async fetchProjectReports(req: any) {
        const query: any = req.query;
        try {
            const data = await dataSource
                .getRepository(Project)
                .createQueryBuilder('projects')
                .leftJoinAndSelect('projects.project_beneficiary', 'project_beneficiaries')
                .where('projects.archived = false')
                .andWhere("to_char(projects.date_created, 'YYYY-MM') >= :from", { from: query.date_from })
                .andWhere("to_char(projects.date_created, 'YYYY - MM') <= :to", { to: query.date_to })
                .andWhere(
                    query.hasOwnProperty('project_pk') && query.project_pk !== 'null' ? 'projects.pk = :pk' : '1=1',
                    { pk: query.project_pk },
                )
                .andWhere(
                    query.hasOwnProperty('status') && query.status !== 'null' ? 'projects.status = :status' : '1=1',
                    { status: query.status },
                )
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

    filterProjectByPartnerName(partner_name: string, projects: any) {
        if (partner_name.trim() !== '') {
            const filtered = projects?.data?.filter((proj) => proj?.partner?.name?.includes(partner_name)) ?? [];
            return {
                status: true,
                data: filtered,
                total: filtered?.length,
            };
        }

        return projects;
    }
}
