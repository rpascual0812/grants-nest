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
import { ProjectFunding } from './entities/project-funding.entity';
import { User } from 'src/user/entities/user.entity';
import { getParsedPk } from 'src/application/utilities/get-parsed-pk.utils';
import { Equal } from 'typeorm';
import { getDefaultValue } from 'src/application/utilities/get-default-value.utils';
import { ProjectFundingReport } from './entities/project-funding-report.entity';
import { ProjectFundingLiquidation } from './entities/project-funding-liquidation.entity';
import { DateTime } from 'luxon';
import { ProjectSite } from './entities/project-site.entity';
import { ProjectEvent } from './entities/project-event.entity';
import { ProjectEventAttendee } from './entities/project-event-attendees.entity';
import { ProjectObjectiveResult } from './entities/project-objective-result.entity';
import { ProjectOutput } from './entities/project-output.entity';

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
            const data = await dataSource
                .getRepository(ProjectFunding)
                .createQueryBuilder('project_fundings')
                .select('project_fundings')
                .leftJoinAndSelect('project_fundings.bank_receipt_document', 'documents')
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
                .leftJoinAndMapOne(
                    'project_fundings.project_funding_liquidation',
                    ProjectFundingLiquidation,
                    'project_funding_liquidations',
                    'project_funding_liquidations.project_funding_pk=project_fundings.pk',
                )
                .leftJoinAndSelect('project_funding_liquidations.documents', 'documents as liquidation_documents')
                .andWhere('project_funding_reports.archived = false')
                .where('project_fundings.project_pk = :project_pk', { project_pk: filters?.project_pk })
                .orderBy('project_funding_reports.date_created', 'ASC')
                .orderBy('project_fundings.date_created', 'ASC')
                .getMany();
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

                        if (
                            project.status == 'Initial Submission' &&
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

                const savedProjectFunding = await EntityManager.save(ProjectFunding, {
                    ...projectFunding,
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
                event.created_by = user.pk;
                event.archived = event.archived ?? false;
                event = await EntityManager.insert(ProjectEvent, event);

                return { status: event ? true : false, data: event.raw[0] }
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
                }
                else {
                    delete data.pk;
                    let attendee = data;
                    attendee.created_by = user.pk;
                    attendee.archived = attendee.archived ?? false;
                    attendee = await EntityManager.insert(ProjectEventAttendee, attendee);
                }

                return { status: attendee ? true : false }
            });
        } catch (err) {
            this.saveError({});
            console.log(err);
            return { status: false, code: err.code };
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
                }
                else {
                    objective_result = data;
                    objective_result.created_by = user.pk;
                    objective_result.archived = objective_result.archived ?? false;
                    objective_result = await EntityManager.insert(ProjectObjectiveResult, objective_result);
                }

                return { status: objective_result ? true : false, data: objective_result }
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
                console.log(project_pk, data);
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
                output.disability_rights = data.disability_rights;
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
}
