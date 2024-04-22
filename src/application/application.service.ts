import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DateTime } from 'luxon';

import dataSource from 'db/data-source';
import { Application } from './entities/application.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal } from 'typeorm';
import { GlobalService } from 'src/utilities/global.service';
import { Log } from 'src/log/entities/log.entity';
import { EmailService } from 'src/email/email.service';
import { Partner } from 'src/partner/entities/partner.entity';
import { PartnerContact } from 'src/partner/entities/partner-contacts.entity';
import { PartnerOrganization } from 'src/partner/entities/partner-organization.entity';
import { Country } from 'src/country/entities/country.entity';
import { getDefaultValue } from './utilities/get-default-value.utils';
import { Project } from 'src/projects/entities/project.entity';
import { ProjectBeneficiary } from 'src/projects/entities/project-beneficiary.entity';
import { ProjectLocation } from 'src/projects/entities/project-location.entity';
import { Review } from 'src/review/entities/review.entity';
import { Type } from 'src/type/entities/type.entity';
import { Document } from 'src/document/entities/document.entity';
import { ApplicationRecommendation } from './entities/application-recommendation.entity';
import { getParsedPk } from './utilities/get-parsed-pk.utils';
import { PartnerFiscalSponsor } from 'src/partner/entities/partner-fiscal-sponsor.entity';
import { ProjectProposal } from 'src/projects/entities/project-proposal.entity';
import { ProjectProposalActivity } from 'src/projects/entities/project-proposal-activity.entity';
import { PartnerOrganizationReference } from 'src/partner/entities/partner-organization-references.entity';
import { PartnerNonprofitEquivalencyDetermination } from 'src/partner/entities/partner-nonprofit-equivalency-determination.entity';
import { PartnerOrganizationBank } from 'src/partner/entities/partner-organization-bank.entity';
import { PartnerOrganizationOtherInformation } from 'src/partner/entities/partner-organization-other-information.entity';
import { PartnerOrganizationOtherInformationFinancialHumanResources } from 'src/partner/entities/partner-organization-other-information-financial-human-resources.entity';
import { Email } from 'src/email/entities/email.entity';

@Injectable()
export class ApplicationService extends GlobalService {
    uuid: string;

    constructor(
        @InjectRepository(Application)
        private emailService: EmailService,
    ) {
        super();
    }

    async findAll(filters: any) {
        try {
            const data = await dataSource.manager
                .getRepository(Application)
                .createQueryBuilder('applications')

                .leftJoinAndSelect('applications.project', 'projects')
                .leftJoinAndSelect('projects.project_beneficiary', 'project_beneficiary')
                .leftJoinAndSelect('projects.project_location', 'project_location')
                .leftJoinAndSelect('projects.project_proposal', 'project_proposals')
                .leftJoinAndSelect('project_proposals.project_proposal_activity', 'project_proposal_activities')

                .leftJoinAndSelect('projects.type', 'types')
                .where('applications.archived = false')
                // .andWhere(
                //     filters.hasOwnProperty('keyword') && filters.keyword != ''
                //         ? '(partners.name ILIKE :keyword or partners.email_address ILIKE :keyword)'
                //         : '1=1',
                //     { keyword: `%${filters.keyword}%` },
                // )
                .andWhere(
                    filters.hasOwnProperty('type_pk') && filters?.type_pk && filters?.type_pk?.trim() !== ''
                        ? 'projects.type_pk = :type_pk'
                        : '1=1',
                    { type_pk: +filters.type_pk },
                )
                .orderBy('applications.date_created', 'DESC')
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
                .getRepository(Application)
                .createQueryBuilder('applications')
                .leftJoinAndSelect('applications.documents', 'documents')
                .leftJoinAndSelect('applications.recommendations', 'application_recommendations')
                .leftJoinAndSelect('applications.project', 'projects')
                .leftJoinAndSelect('projects.project_location', 'project_location')
                .leftJoinAndSelect('projects.project_beneficiary', 'project_beneficiary')
                .leftJoinAndSelect('projects.project_proposal', 'project_proposals')
                .leftJoinAndSelect('project_proposals.project_proposal_activity', 'project_proposal_activity')
                .leftJoinAndSelect('projects.type', 'types')

                .andWhere(filter.hasOwnProperty('pk') ? 'applications.pk = :pk' : '1=1', { pk: filter.pk })
                .andWhere(filter.hasOwnProperty('uuid') ? 'applications.uuid = :uuid' : '1=1', { uuid: filter.uuid })
                .andWhere(filter.hasOwnProperty('number') ? 'applications.number = :number' : '1=1', {
                    number: filter.number,
                })
                .andWhere('applications.archived = :archived', { archived: false })
                // .andWhere(filter.hasOwnProperty('reviews') ? 'reviews.archived = false' : '1=1')
                // .orderBy('reviews.pk', 'ASC')
                // .orderBy({
                //     'partner_organization_references.pk': 'ASC',
                // })
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
                .getRepository(Application)
                .createQueryBuilder('applications')
                .select('applications')
                .leftJoinAndSelect('applications.reviews', 'reviews')
                .leftJoinAndSelect('reviews.user', 'users')
                .leftJoinAndSelect('reviews.documents', 'documents as review_documents')
                .where('applications.pk IN (:...pk)', { pk: pks })
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

    async generate(data: any, user: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            this.uuid = data.uuid ? data.uuid : uuidv4();
            const date = DateTime.now();

            return await queryRunner.manager.transaction(async (EntityManager) => {
                const application_number = await this.setApplicationNumber();

                if (!data.partner_pk) {
                    const new_partner_id = await this.setPartnerId();

                    // this is one better than the insert below. Once one of the queries here failed, everything will be rolled back.
                    // the only problem with this query is the new pk is still not visible when inserting the application below
                    // const partner = new Partner();
                    // partner.partner_id = new_partner_id.toString();
                    // partner.name = data.partner_name;
                    // partner.email_address = data.email_address;
                    // let partnerObj = await EntityManager.save(partner);

                    // this is a little off because it won't roll back if something went wrong with the other queries here.
                    const partner = await dataSource.manager
                        .getRepository(Partner)
                        .createQueryBuilder('partners')
                        .createQueryBuilder()
                        .insert()
                        .into(Partner)
                        .values([
                            {
                                partner_id: new_partner_id.toString(),
                                name: data.partner_name,
                                email_address: data.email_address,
                            },
                        ])
                        .returning('pk')
                        .execute();
                    data.partner_pk = partner.generatedMaps[0].pk;
                }

                const obj: any = {
                    uuid: this.uuid,
                    number: application_number,
                    created_by: user.pk,
                    partner_pk: data.partner_pk,
                };

                // const application = this.applicationRepository.create(obj);
                const new_application = await dataSource.manager
                    .getRepository(Application)
                    .createQueryBuilder('applications')
                    .createQueryBuilder()
                    .insert()
                    .into(Application)
                    .values([obj])
                    .returning('pk')
                    .execute();
                const new_application_pk = new_application.generatedMaps[0].pk;

                // send email
                this.emailService.uuid = uuidv4();
                this.emailService.user_pk = user.pk;
                this.emailService.from = process.env.SEND_FROM;
                this.emailService.from_name = process.env.SENDER;
                this.emailService.to = data.email_address;
                this.emailService.to_name = '';
                this.emailService.subject = 'Grants Application';
                this.emailService.body = '<a href="' + data.link + '">Please follow this link</a>'; // MODIFY: must be a template from the database

                await this.emailService.create();
                return this.find({ pk: new_application_pk });
            });
        } catch (err) {
            this.saveError(err);
            return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }
    }

    async save(data: any, user: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                if (data.hasOwnProperty('application')) {
                    await EntityManager.update(Application, { pk: data.application_pk }, data.application);
                }
                if (data.hasOwnProperty('project')) {
                    await EntityManager.update(
                        Project,
                        { application_pk: data.application_pk },
                        {
                            duration: data?.project?.duration,
                            title: data?.project?.title,
                            background: data?.project?.background,
                            expected_output: data?.project?.expected_output,
                            how_will_affect: data?.project?.how_will_affect,
                            objective: data?.project?.objective,
                            type_pk: data?.project?.type_pk,
                        },
                    );
                }

                return { status: true, code: 200 };
            });
        } catch (err) {
            this.saveError({});
            console.log(err);
            return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }
    }

    async savePartner(data: any, user: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                const partnerID = data?.partner_id;

                const existingPartner = await EntityManager.findOne(Partner, {
                    where: {
                        partner_id: Equal(partnerID),
                    },
                });

                const partner = existingPartner ? existingPartner : new Partner();
                const generatedPartnerId = existingPartner?.partner_id
                    ? existingPartner?.partner_id
                    : await this.setPartnerId();

                partner.partner_id = getDefaultValue(generatedPartnerId, existingPartner?.partner_id);
                partner.name = getDefaultValue(data?.name, existingPartner?.name);
                partner.email_address = getDefaultValue(data?.email_address, existingPartner?.email_address);
                partner.address = getDefaultValue(data?.address, existingPartner?.address);
                partner.contact_number = getDefaultValue(data?.contact_number, existingPartner?.contact_number);
                partner.website = getDefaultValue(data?.website, existingPartner?.website);

                const savedPartner = await EntityManager.save(Partner, {
                    ...partner,
                });

                const model = {
                    pk: savedPartner?.pk,
                    name: 'partner',
                    status: existingPartner ? 'update' : 'insert',
                };

                await this.saveLog({ model, user });

                let savedPartnerContacts = undefined;
                const existingContact = await EntityManager.findOne(PartnerContact, {
                    where: {
                        partner_pk: savedPartner.pk,
                    },
                });

                const partnerContact = existingContact ? existingContact : new PartnerContact();
                partnerContact.partner_pk = savedPartner.pk;
                partnerContact.name = getDefaultValue(data?.contacts?.at(0)?.name, existingContact?.name);
                partnerContact.contact_number = getDefaultValue(
                    data?.contacts?.at(0)?.contact_number,
                    existingContact?.contact_number,
                );
                partnerContact.email_address = getDefaultValue(
                    data?.contacts?.at(0)?.email_address,
                    existingContact?.email_address,
                );

                if (existingContact || data?.contacts?.length > 0) {
                    savedPartnerContacts = await EntityManager.save(PartnerContact, {
                        ...partnerContact,
                    });
                }

                const modelPartnerContact = {
                    pk: savedPartnerContacts?.pk,
                    name: 'partner_contacts',
                    status: existingContact ? 'update' : 'insert',
                };

                await this.saveLog({
                    model: modelPartnerContact,
                    user,
                });

                const dataDocuments = Array.isArray(data?.documents) ? data?.documents ?? [] : [];
                if (existingContact || dataDocuments?.length > 0) {
                    dataDocuments.forEach((doc) => {
                        EntityManager.query(
                            'insert into document_partner_relation (document_pk, partner_pk) values ($1 ,$2) ON CONFLICT DO NOTHING;',
                            [doc.pk, existingPartner.pk],
                        );
                    });
                }

                return {
                    status: true,
                    data: {
                        ...savedPartner,
                        contacts: savedPartnerContacts ? [savedPartnerContacts] : [],
                    },
                };
            });
        } catch (err) {
            console.log(err);
            this.saveError({});
            console.log(err);
            return { status: false, code: err?.code };
        } finally {
            await queryRunner.release();
        }
    }

    async savePartnerOrg(data: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                const partner_id = data?.partner_id;

                const existingPartner = await EntityManager.findOne(Partner, {
                    where: {
                        partner_id,
                    },
                });
                const partner_pk = existingPartner.pk;
                const existingPartnerOrg = await EntityManager.findOne(PartnerOrganization, {
                    where: {
                        partner_pk: existingPartner?.pk,
                    },
                });
                const partnerOrg = existingPartnerOrg ? existingPartnerOrg : new PartnerOrganization();
                partnerOrg.partner_pk = getDefaultValue(partner_pk, existingPartnerOrg?.partner_pk);
                partnerOrg.organization_pk = getDefaultValue(
                    data?.organization_pk,
                    existingPartnerOrg?.organization_pk,
                );
                partnerOrg.tribe = getDefaultValue(data?.tribe, existingPartnerOrg?.tribe);
                partnerOrg.womens_organization = getDefaultValue(
                    data?.womens_organization,
                    existingPartnerOrg?.womens_organization,
                );
                partnerOrg.youth_organization = getDefaultValue(
                    data?.youth_organization,
                    existingPartnerOrg?.youth_organization,
                );
                partnerOrg.differently_abled_organization = getDefaultValue(
                    data?.differently_abled_organization,
                    existingPartnerOrg?.differently_abled_organization,
                );
                partnerOrg.other_sectoral_group = getDefaultValue(
                    data?.other_sectoral_group,
                    existingPartnerOrg?.other_sectoral_group,
                );
                partnerOrg.farmers_group = getDefaultValue(data?.farmers_group, existingPartnerOrg?.farmers_group);
                partnerOrg.fisherfolks = getDefaultValue(data?.fisherfolks, existingPartnerOrg?.fisherfolks);
                partnerOrg.mission = getDefaultValue(data?.mission, existingPartnerOrg?.mission);
                partnerOrg.vision = getDefaultValue(data?.vision, existingPartnerOrg?.vision);
                partnerOrg.description = getDefaultValue(data?.description, existingPartnerOrg?.description);
                partnerOrg.country_pk = getDefaultValue(data?.country_pk, existingPartnerOrg?.country_pk);
                partnerOrg.project_website = getDefaultValue(
                    data?.project_website,
                    existingPartnerOrg?.project_website,
                );

                const savedPartnerOrg = await EntityManager.save(PartnerOrganization, {
                    ...partnerOrg,
                });

                return {
                    status: true,
                    data: {
                        ...savedPartnerOrg,
                    },
                };
            });
        } catch (err) {
            console.log(err);
            this.saveError({});
            return { status: false, code: err?.code };
        } finally {
            await queryRunner.release();
        }
    }

    async saveFiscalSponsor(data: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                const partnerFiscalSponsor = getParsedPk(data?.pk);
                const appPartnerPk = getParsedPk(data?.partner_pk);
                const existingFiscalSponsor = await EntityManager.findOne(PartnerFiscalSponsor, {
                    where: {
                        partner_pk: Equal(appPartnerPk),
                    },
                });

                const fiscalSponsor = existingFiscalSponsor ? existingFiscalSponsor : new PartnerFiscalSponsor();
                fiscalSponsor.partner_pk = appPartnerPk;
                fiscalSponsor.name = getDefaultValue(data?.name, existingFiscalSponsor?.name);
                fiscalSponsor.address = getDefaultValue(data?.address, existingFiscalSponsor?.address);
                fiscalSponsor.head = getDefaultValue(data?.head, existingFiscalSponsor?.head);
                fiscalSponsor.person_in_charge = getDefaultValue(
                    data?.person_in_charge,
                    existingFiscalSponsor?.person_in_charge,
                );
                fiscalSponsor.contact_number = getDefaultValue(
                    data?.contact_number,
                    existingFiscalSponsor?.contact_number,
                );
                fiscalSponsor.email_address = getDefaultValue(
                    data?.email_address,
                    existingFiscalSponsor?.email_address,
                );
                fiscalSponsor.account_number = getDefaultValue(
                    data?.account_number,
                    existingFiscalSponsor?.account_number,
                );
                fiscalSponsor.bank_account_name = getDefaultValue(
                    data?.bank_account_name,
                    existingFiscalSponsor?.bank_account_name,
                );
                fiscalSponsor.bank_name = getDefaultValue(data?.bank_name, existingFiscalSponsor?.bank_name);
                fiscalSponsor.bank_branch = getDefaultValue(data?.bank_branch, existingFiscalSponsor?.bank_branch);
                fiscalSponsor.bank_address = getDefaultValue(data?.bank_address, existingFiscalSponsor?.bank_address);
                fiscalSponsor.swift_code = getDefaultValue(data?.swift_code, existingFiscalSponsor?.swift_code);
                console.log('fiscalSponsor', fiscalSponsor);
                const savedFiscalSponsor = await EntityManager.save(PartnerFiscalSponsor, {
                    ...fiscalSponsor,
                });

                if (data?.documents) {
                    data?.documents.forEach((doc: any) => {
                        EntityManager.query(
                            'insert into document_partner_fiscal_sponsor_relation (document_pk, partner_fiscal_sponsor_pk) values ($1 ,$2) ON CONFLICT DO NOTHING;',
                            [doc.pk, fiscalSponsor.pk],
                        );
                    });
                }

                return {
                    status: true,
                    data: {
                        ...savedFiscalSponsor,
                    },
                };
            });
        } catch (err) {
            console.log(err);
            this.saveError({});
            return { status: false, code: err?.code };
        } finally {
            await queryRunner.release();
        }
    }

    async saveProject(data: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            const savedProject = await queryRunner.manager.transaction(async (EntityManager) => {
                const appProjectPk = getParsedPk(data?.pk);
                const applicationPk = getParsedPk(data?.application_pk);
                const existingProject = await EntityManager.findOne(Project, {
                    where: {
                        pk: Equal(appProjectPk),
                    },
                });
                const existingApplication = await EntityManager.findOne(Application, {
                    where: {
                        pk: Equal(applicationPk),
                    },
                });

                const project = existingProject ? existingProject : new Project();
                project.application_pk = applicationPk;
                project.partner_pk = existingApplication?.partner_pk;
                project.title = getDefaultValue(data?.title, existingProject?.title);
                project.duration = getDefaultValue(data?.duration, existingProject?.duration);
                project.background = getDefaultValue(data?.background, existingProject?.background);
                project.objective = getDefaultValue(data?.objective, existingProject?.objective);
                project.expected_output = getDefaultValue(data?.expected_output, existingProject?.expected_output);
                project.how_will_affect = getDefaultValue(data?.how_will_affect, existingProject?.how_will_affect);
                // project.status_pk = getDefaultValue(data?.status_pk, existingProject?.status_pk);
                project.type_pk = getDefaultValue(data?.type_pk, existingProject?.type_pk);

                const savedProject = await EntityManager.save(Project, {
                    ...project,
                });
                return savedProject;
            });

            const projPk = savedProject?.pk;

            let savedProjLoc = [];
            const projLoc = data?.project_location ?? [];
            const resProj: any = await this.saveProjLocation({
                project_pk: projPk,
                project_location: projLoc,
            });
            savedProjLoc = resProj?.data?.project_location;

            let savedProjBeneficiary = [];
            const projBeneficiary = data?.project_beneficiary ?? [];
            const resBeneficiary: any = await this.saveProjBeneficiary({
                project_pk: projPk,
                project_beneficiary: projBeneficiary,
            });
            savedProjBeneficiary = resBeneficiary?.data?.project_beneficiary;

            return {
                status: true,
                data: {
                    ...savedProject,
                    project_location: savedProjLoc,
                    project_beneficiary: savedProjBeneficiary,
                },
            };
        } catch (err) {
            console.log(err);
            this.saveError({});
            return { status: false, code: err?.code };
        } finally {
            await queryRunner.release();
        }
    }

    async saveProjLocation(data: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                const projectPk = data?.project_pk;
                const projLocs = data?.project_location ?? [];

                const tmpProjLoc = projLocs.map(async (item) => {
                    const projPk = getParsedPk(item?.pk);
                    const existingProjLoc = await EntityManager.findOneBy(ProjectLocation, {
                        pk: Equal(projPk),
                        project_pk: Equal(projectPk),
                    });

                    const projLoc = existingProjLoc ? existingProjLoc : new ProjectLocation();
                    projLoc.project_pk = projectPk;
                    projLoc.country_pk = getDefaultValue(item?.country_pk, existingProjLoc?.country_pk);
                    projLoc.province_code = getDefaultValue(item?.province_code, existingProjLoc?.province_code);

                    const savedItem = await EntityManager.save(ProjectLocation, {
                        ...projLoc,
                    });

                    return {
                        ...savedItem,
                    };
                });

                await Promise.all(tmpProjLoc);

                const existingProjLoc =
                    (await EntityManager.findBy(ProjectLocation, {
                        project_pk: Equal(projectPk),
                    })) ?? [];

                const allProj = [...existingProjLoc];

                return {
                    status: true,
                    data: {
                        project_location: allProj,
                    },
                };
            });
        } catch (err) {
            console.log(err);
            this.saveError({});
            return { status: false, code: err?.code };
        } finally {
            await queryRunner.release();
        }
    }

    async saveProjBeneficiary(data: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                const projectPk = data?.project_pk;
                const projBeneficiary = data?.project_beneficiary ?? [];
                const tmpProjBeneficiary = projBeneficiary.map(async (item) => {
                    const beneficiaryPk = getParsedPk(item?.pk);
                    const existingProjBeneficiary = await EntityManager.findOneBy(ProjectBeneficiary, {
                        pk: Equal(beneficiaryPk),
                        project_pk: Equal(projectPk),
                    });

                    const beneficiary = existingProjBeneficiary ? existingProjBeneficiary : new ProjectBeneficiary();
                    beneficiary.project_pk = projectPk;
                    beneficiary.type = getDefaultValue(item?.type, existingProjBeneficiary?.type);
                    beneficiary.name = getDefaultValue(item?.name, existingProjBeneficiary?.name);
                    beneficiary.count = getDefaultValue(item?.count, existingProjBeneficiary?.count);

                    const savedItem = await EntityManager.save(ProjectBeneficiary, {
                        ...beneficiary,
                    });

                    return {
                        ...savedItem,
                    };
                });

                await Promise.all(tmpProjBeneficiary);

                const existingProjLoc =
                    (await EntityManager.findBy(ProjectBeneficiary, {
                        project_pk: Equal(projectPk),
                    })) ?? [];

                const allProj = [...existingProjLoc];

                return {
                    status: true,
                    data: {
                        project_beneficiary: allProj,
                    },
                };
            });
        } catch (err) {
            console.log(err);
            this.saveError({});
            return { status: false, code: err?.code };
        } finally {
            await queryRunner.release();
        }
    }

    async saveProposal(data: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            const savedProposal = await queryRunner.manager.transaction(async (EntityManager) => {
                const appProposalPk = getParsedPk(data?.pk);
                const projectPk = getParsedPk(data?.project_pk);
                const existingProposal = await EntityManager.findOne(ProjectProposal, {
                    where: {
                        pk: Equal(appProposalPk),
                        project_pk: Equal(projectPk),
                    },
                });

                const proposal = existingProposal ? existingProposal : new ProjectProposal();
                proposal.project_pk = projectPk;
                proposal.monitor = getDefaultValue(data?.monitor, existingProposal?.monitor);
                proposal.budget_request_other_currency = getDefaultValue(
                    data?.budget_request_other_currency,
                    existingProposal?.budget_request_other_currency,
                );
                proposal.budget_request_usd = getDefaultValue(
                    data?.budget_request_usd,
                    +existingProposal?.budget_request_usd,
                );
                proposal.budget_request_other = getDefaultValue(
                    data?.budget_request_other,
                    +existingProposal?.budget_request_other,
                );

                const savedProposal = await EntityManager.save(ProjectProposal, {
                    ...proposal,
                });

                return savedProposal;
            });

            const appProposalPk = savedProposal?.pk;

            let savedProposalAct = [];
            const proposalActivity = data?.application_proposal_activity ?? [];
            const resProposalAct: any = await this.saveProposalActivity({
                project_proposal_pk: appProposalPk ?? savedProposal?.pk,
                project_proposal_activity: proposalActivity,
            });
            savedProposalAct = resProposalAct?.data?.project_proposal_activity;

            return {
                status: true,
                data: {
                    ...savedProposal,
                    project_proposal_activity: savedProposalAct,
                },
            };
        } catch (err) {
            console.log(err);
            this.saveError({});
            return { status: false, code: err?.code };
        } finally {
            await queryRunner.release();
        }
    }

    async saveProposalActivity(data: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                const appProposalPk = data?.project_proposal_pk;
                const proposalActivity = data?.project_proposal_activity ?? [];

                const tmpProposalAct = proposalActivity?.map(async (item) => {
                    const proposalPk = getParsedPk(item?.pk);
                    const existingProposalActivity = await EntityManager.findOneBy(ProjectProposalActivity, {
                        pk: Equal(proposalPk),
                        project_proposal_pk: Equal(appProposalPk),
                    });

                    const activity = existingProposalActivity
                        ? existingProposalActivity
                        : new ProjectProposalActivity();

                    activity.project_proposal_pk = appProposalPk;
                    activity.name = item.name;
                    activity.duration = item.duration;

                    const savedItem = await EntityManager.save(ProjectProposalActivity, {
                        ...activity,
                    });

                    return {
                        ...savedItem,
                    };
                });

                await Promise.all(tmpProposalAct);

                const existingAppProposalAct =
                    (await EntityManager.findBy(ProjectProposalActivity, {
                        project_proposal_pk: Equal(appProposalPk),
                    })) ?? [];

                const allItem = [...existingAppProposalAct];

                return {
                    status: true,
                    data: {
                        project_proposal_activity: allItem,
                    },
                };
            });
        } catch (err) {
            console.log(err);
            this.saveError({});
            return { status: false, code: err?.code };
        } finally {
            await queryRunner.release();
        }
    }

    async saveNonProfitEquivalencyDetermination(data: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                const appNonProfitEquivalencyDeterminationPk = getParsedPk(data?.pk);
                const partnerPk = getParsedPk(data?.partner_pk);
                const existingNonProfitEquivalencyDetermination = await EntityManager.findOne(
                    PartnerNonprofitEquivalencyDetermination,
                    {
                        where: {
                            partner_pk: Equal(partnerPk),
                            pk: Equal(appNonProfitEquivalencyDeterminationPk),
                        },
                    },
                );

                const nonProfitEquivalencyDetermination = existingNonProfitEquivalencyDetermination
                    ? existingNonProfitEquivalencyDetermination
                    : new PartnerNonprofitEquivalencyDetermination();

                nonProfitEquivalencyDetermination.partner_pk = data.partner_pk;
                nonProfitEquivalencyDetermination.year = getDefaultValue(
                    data?.year,
                    existingNonProfitEquivalencyDetermination?.year,
                );
                nonProfitEquivalencyDetermination.financial_last_year_usd = getDefaultValue(
                    data?.financial_last_year_usd,
                    existingNonProfitEquivalencyDetermination?.financial_last_year_usd,
                );
                nonProfitEquivalencyDetermination.financial_last_year_other = getDefaultValue(
                    data?.financial_last_year_other,
                    existingNonProfitEquivalencyDetermination?.financial_last_year_other,
                );
                nonProfitEquivalencyDetermination.financial_last_year_other_currency = getDefaultValue(
                    data?.financial_last_year_other_currency,
                    existingNonProfitEquivalencyDetermination?.financial_last_year_other_currency,
                );
                nonProfitEquivalencyDetermination.financial_last_year_source = getDefaultValue(
                    data?.financial_last_year_source,
                    existingNonProfitEquivalencyDetermination?.financial_last_year_source,
                );
                nonProfitEquivalencyDetermination.financial_current_usd = getDefaultValue(
                    data?.financial_current_usd,
                    existingNonProfitEquivalencyDetermination?.financial_current_usd,
                );
                nonProfitEquivalencyDetermination.financial_current_other = getDefaultValue(
                    data?.financial_current_other,
                    existingNonProfitEquivalencyDetermination?.financial_current_other,
                );
                nonProfitEquivalencyDetermination.financial_current_other_currency = getDefaultValue(
                    data?.financial_current_other_currency,
                    existingNonProfitEquivalencyDetermination?.financial_current_other_currency,
                );
                nonProfitEquivalencyDetermination.financial_current_source = getDefaultValue(
                    data?.financial_current_source,
                    existingNonProfitEquivalencyDetermination?.financial_current_source,
                );
                nonProfitEquivalencyDetermination.officers = getDefaultValue(
                    data?.officers,
                    existingNonProfitEquivalencyDetermination?.officers,
                );
                nonProfitEquivalencyDetermination.members = getDefaultValue(
                    data?.members,
                    existingNonProfitEquivalencyDetermination?.members,
                );
                nonProfitEquivalencyDetermination.operated_for = getDefaultValue(
                    data?.operated_for,
                    existingNonProfitEquivalencyDetermination?.operated_for,
                );
                nonProfitEquivalencyDetermination.operated_for_others = getDefaultValue(
                    data?.operated_for_others,
                    existingNonProfitEquivalencyDetermination?.operated_for_others,
                );
                nonProfitEquivalencyDetermination.any_assets = getDefaultValue(
                    data?.any_assets,
                    existingNonProfitEquivalencyDetermination?.any_assets,
                );
                nonProfitEquivalencyDetermination.any_assets_description = getDefaultValue(
                    data?.any_assets_description,
                    existingNonProfitEquivalencyDetermination?.any_assets_description,
                );
                nonProfitEquivalencyDetermination.any_payments = getDefaultValue(
                    data?.any_payments,
                    existingNonProfitEquivalencyDetermination?.any_payments,
                );
                nonProfitEquivalencyDetermination.any_payments_description = getDefaultValue(
                    data?.any_payments_description,
                    existingNonProfitEquivalencyDetermination?.any_payments_description,
                );
                nonProfitEquivalencyDetermination.upon_dissolution = getDefaultValue(
                    data?.upon_dissolution,
                    existingNonProfitEquivalencyDetermination?.upon_dissolution,
                );
                nonProfitEquivalencyDetermination.is_controlled_by = getDefaultValue(
                    data?.is_controlled_by,
                    existingNonProfitEquivalencyDetermination?.is_controlled_by,
                );

                const savedNonProfitEquivalencyDetermination = await EntityManager.save(
                    PartnerNonprofitEquivalencyDetermination,
                    {
                        ...nonProfitEquivalencyDetermination,
                    },
                );

                if (data?.documents) {
                    data?.documents.forEach((doc: any) => {
                        EntityManager.query(
                            'insert into document_partner_nonprofit_equivalency_determination_relation (document_pk, partner_nonprofit_equivalency_determination_pk) values ($1 ,$2) ON CONFLICT DO NOTHING;',
                            [doc.pk, data.pk],
                        );
                    });
                }

                return {
                    status: true,
                    data: {
                        ...savedNonProfitEquivalencyDetermination,
                    },
                };
            });
        } catch (err) {
            console.log(err);
            this.saveError({});
            return { status: false, code: err?.code };
        } finally {
            await queryRunner.release();
        }
    }

    async saveOrganizationBankAccount(data: any, user: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                const partnerOrgPk = getParsedPk(data?.partner_organization_pk);
                const partnerOrgBankPk = getParsedPk(data?.pk);
                const existingPartnerOrgBank = await EntityManager.findOne(PartnerOrganizationBank, {
                    where: {
                        partner_organization_pk: Equal(partnerOrgPk),
                        pk: Equal(partnerOrgBankPk),
                    },
                });

                const partnerOrgBank = existingPartnerOrgBank ? existingPartnerOrgBank : new PartnerOrganizationBank();
                partnerOrgBank.partner_organization_pk = partnerOrgPk;
                partnerOrgBank.account_name = getDefaultValue(data?.account_name, existingPartnerOrgBank?.account_name);
                partnerOrgBank.account_number = getDefaultValue(
                    data?.account_number,
                    existingPartnerOrgBank?.account_number,
                );
                partnerOrgBank.bank_address = getDefaultValue(data?.bank_address, existingPartnerOrgBank?.bank_address);
                partnerOrgBank.bank_branch = getDefaultValue(data?.bank_branch, existingPartnerOrgBank?.bank_branch);
                partnerOrgBank.bank_name = getDefaultValue(data?.bank_name, existingPartnerOrgBank?.bank_name);
                partnerOrgBank.swift_code = getDefaultValue(data?.swift_code, existingPartnerOrgBank?.swift_code);
                partnerOrgBank.created_by = user?.pk;
                const savedPartnerOrgBank = await EntityManager.save(PartnerOrganizationBank, {
                    ...partnerOrgBank,
                });
                return {
                    status: true,
                    data: {
                        ...savedPartnerOrgBank,
                    },
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

    async saveOrganizationOtherInfo(data: any, user: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                const partnerOrgPk = getParsedPk(data?.partner_organization_pk);
                const partnerOrgOtherInfoPk = getParsedPk(data?.pk);
                const existingPartnerOrgOtherInfo = await EntityManager.findOne(PartnerOrganizationOtherInformation, {
                    where: {
                        partner_organization_pk: Equal(partnerOrgPk),
                        pk: Equal(partnerOrgOtherInfoPk),
                    },
                });

                const partnerOrgOtherInfo = existingPartnerOrgOtherInfo
                    ? existingPartnerOrgOtherInfo
                    : new PartnerOrganizationOtherInformation();

                partnerOrgOtherInfo.partner_organization_pk = partnerOrgPk;

                partnerOrgOtherInfo.has_project = getDefaultValue(
                    data?.has_project,
                    existingPartnerOrgOtherInfo?.has_project,
                );
                partnerOrgOtherInfo.has_financial_policy = getDefaultValue(
                    data?.has_financial_policy,
                    existingPartnerOrgOtherInfo?.has_financial_policy,
                );
                partnerOrgOtherInfo.has_financial_policy_no_reason = getDefaultValue(
                    data?.has_financial_policy_no_reason,
                    existingPartnerOrgOtherInfo?.has_financial_policy_no_reason,
                );
                partnerOrgOtherInfo.has_financial_system = getDefaultValue(
                    data?.has_financial_system,
                    existingPartnerOrgOtherInfo?.has_financial_system,
                );
                partnerOrgOtherInfo.has_financial_system_no_reason = getDefaultValue(
                    data?.has_financial_system_no_reason,
                    existingPartnerOrgOtherInfo?.has_financial_system_no_reason,
                );
                partnerOrgOtherInfo.audit_financial_available = getDefaultValue(
                    data?.audit_financial_available,
                    existingPartnerOrgOtherInfo?.audit_financial_available,
                );

                partnerOrgOtherInfo.has_reviewed_financial_system = getDefaultValue(
                    data?.has_reviewed_financial_system,
                    existingPartnerOrgOtherInfo?.has_reviewed_financial_system,
                );
                partnerOrgOtherInfo.recommendation = getDefaultValue(
                    data?.recommendation,
                    existingPartnerOrgOtherInfo?.recommendation,
                );
                partnerOrgOtherInfo.created_by = user.pk;
                const savedPartnerOrgOtherInfo = await EntityManager.save(PartnerOrganizationOtherInformation, {
                    ...partnerOrgOtherInfo,
                });

                if (data?.documents) {
                    data?.documents.forEach((doc: any) => {
                        EntityManager.query(
                            'insert into document_partner_organization_other_info_relation (document_pk, partner_organization_other_info_pk) values ($1 ,$2) ON CONFLICT DO NOTHING;',
                            [doc.pk, savedPartnerOrgOtherInfo.pk],
                        );
                    });
                }

                if (data?.human_resources) {
                    data?.human_resources.forEach((hr: any) => {
                        if (hr.hasOwnProperty('pk')) {
                            EntityManager.update(
                                PartnerOrganizationOtherInformationFinancialHumanResources,
                                { pk: hr.pk },
                                hr,
                            );
                        } else {
                            dataSource
                                .createQueryBuilder()
                                .insert()
                                .into(PartnerOrganizationOtherInformationFinancialHumanResources)
                                .values([
                                    {
                                        partner_organization_other_information_pk: savedPartnerOrgOtherInfo.pk,
                                        name: hr.name,
                                        designation: hr.designation,
                                        created_by: user.pk,
                                    },
                                ])
                                .returning('*')
                                .execute();
                        }
                    });
                }

                return {
                    status: true,
                    data: {
                        ...savedPartnerOrgOtherInfo,
                    },
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

    async saveReference(data: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                const partnerOrganizationPk = getParsedPk(data?.partner_organization_pk);
                const appReference = data?.partner_organization_reference ?? [];

                const tmpReference = appReference?.map(async (item) => {
                    const referencePk = getParsedPk(item?.pk);
                    const existingReference = await EntityManager.findOneBy(PartnerOrganizationReference, {
                        pk: Equal(referencePk),
                        partner_organization_pk: Equal(partnerOrganizationPk),
                    });

                    const reference = existingReference ? existingReference : new PartnerOrganizationReference();

                    reference.partner_organization_pk = partnerOrganizationPk;
                    reference.name = getDefaultValue(item?.name, existingReference?.name);
                    reference.contact_number = getDefaultValue(item?.contact_number, existingReference?.contact_number);
                    reference.email_address = getDefaultValue(item?.email_address, existingReference?.email_address);
                    reference.organization_name = getDefaultValue(
                        item?.organization_name,
                        existingReference?.organization_name,
                    );

                    const savedItem = await EntityManager.save(PartnerOrganizationReference, {
                        ...reference,
                    });

                    return {
                        ...savedItem,
                    };
                });

                await Promise.all(tmpReference);

                const existingAppReference =
                    (await EntityManager.findBy(PartnerOrganizationReference, {
                        partner_organization_pk: Equal(partnerOrganizationPk),
                    })) ?? [];

                const allItem = [...existingAppReference];

                return {
                    status: true,
                    data: {
                        partner_organization_reference: allItem,
                    },
                };
            });
        } catch (err) {
            console.log(err);
            this.saveError({});
            return { status: false, code: err?.code };
        } finally {
            await queryRunner.release();
        }
    }

    async remove(pk: number, user: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                EntityManager.update(Application, { pk }, { archived: true });

                // save logs
                const model = { pk, name: 'applications', status: 'deleted' };
                await this.saveLog({ model, user });

                return { status: true };
            });
        } catch (err) {
            this.saveError({});
            return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }
    }

    async removeProjectLocation(project_pk: number, location_pk: number, user: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                const location = await EntityManager.findOneBy(ProjectLocation, {
                    pk: Equal(location_pk),
                });

                await location.remove();

                // save logs
                const model = {
                    pk: location_pk,
                    name: 'project_locations',
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

    async removeProposalActivity(proposal_pk: number, activity_pk: number, user: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (_EntityManager) => {
                const activity = await ProjectProposalActivity.findOneBy({
                    pk: Equal(activity_pk),
                });
                await activity.remove();

                // save logs
                const model = {
                    pk: activity_pk,
                    name: 'project_proposal_activity',
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

    async saveReview(data: any, user: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                const review = new Review();
                review.message = data.message;
                review.needs_resolution = data.needs_resolution;
                review.grantee = data.grantee;
                review.type = data.type;
                review.created_by = user.pk;
                review.documents = data.documents;
                const newReview = await dataSource.manager.save(review);

                if (newReview) {
                    let application = await Application.findOneBy({
                        pk: data.application_pk,
                    });

                    if (application.status == 'Received Proposals' && data.type == 'grants_team_review') {
                        application.status = 'Grants Team Review';
                        application.save();
                    }

                    // this is working but it only keeps one record per application
                    // let application = await Application.findOneBy({
                    //     pk: data.application_pk
                    // });

                    // application.reviews = [review];
                    // application.save();

                    await EntityManager.query(
                        'insert into review_application_relation (review_pk, application_pk) values ($1 ,$2) ON CONFLICT DO NOTHING;',
                        [newReview.pk, data.application_pk],
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

    async saveType(data: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                const typePk = data?.type_pk;
                const applicationPk = data?.application_pk;
                const type = await EntityManager.findOne(Type, {
                    where: {
                        pk: typePk,
                    },
                });

                if (type && applicationPk) {
                    await EntityManager.query(
                        'insert into type_application_relation (type_pk, application_pk) values ($1 ,$2) ON CONFLICT DO NOTHING;',
                        [type.pk, applicationPk],
                    );

                    return {
                        status: true,
                        data: {
                            ...type,
                            application_pk: applicationPk,
                        },
                    };
                } else {
                    return {
                        status: false,
                        code: 500,
                        message: 'Type/Application not found',
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

    async saveAttachment(data: any, user: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                const application_pk = data?.application_pk;

                if (application_pk && data.file.pk) {
                    await EntityManager.update(Document, { pk: data.file.pk }, { type: data.type });

                    const document = await EntityManager.query(
                        'insert into document_application_relation (document_pk, application_pk) values ($1 ,$2) ON CONFLICT DO NOTHING;',
                        [data.file.pk, application_pk],
                    );
                    return {
                        status: document ? true : false,
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

    async saveRecommendation(data: any, user: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                const application_pk = data?.application_pk;

                if (application_pk) {
                    const exists = await ApplicationRecommendation.findOneBy({
                        application_pk: data.application_pk,
                        type: data.type,
                    });

                    let newRecommendation = null;
                    if (exists) {
                        newRecommendation = await EntityManager.update(
                            ApplicationRecommendation,
                            { application_pk: data.application_pk, type: data.type },
                            { recommendation: data.recommendation },
                        );
                    } else {
                        const recommendation = new ApplicationRecommendation();
                        recommendation.application_pk = data.application_pk;
                        recommendation.recommendation = data.recommendation;
                        recommendation.type = data.type;
                        recommendation.created_by = user.pk;
                        newRecommendation = await dataSource.manager.save(recommendation);
                    }

                    if (newRecommendation) {
                        let application = await Application.findOneBy({
                            pk: data.application_pk,
                        });

                        if (
                            (application.status == 'Received Proposals' ||
                                application.status == 'Grants Team Review') &&
                            data.recommendation == 'Approved for Next Stage'
                        ) {
                            application.status = 'Advisers Review';
                            application.save();
                        } else if (
                            application.status == 'Advisers Review' &&
                            data.recommendation == 'Approved for Next Stage'
                        ) {
                            application.status = 'Budget Review and Finalization';
                            application.save();
                        } else if (
                            application.status == 'Budget Review and Finalization' &&
                            data.recommendation == 'Approved for Next Stage'
                        ) {
                            application.status = 'Financial Management Capacity';
                            application.save();
                        } else if (
                            application.status == 'Financial Management Capacity' &&
                            data.recommendation == 'Approved for Next Stage'
                        ) {
                            application.status = 'Due Diligence Final Review';
                            application.save();
                        } else if (
                            application.status == 'Due Diligence Final Review' &&
                            data.recommendation == 'Approved for Next Stage'
                        ) {
                            application.status = 'Approved';
                            application.save();

                            await EntityManager.update(Project, { application_pk: data.application_pk }, { status: 'Contract Preparation' });
                        }
                    }

                    // save logs
                    const model = {
                        pk: data.application_pk,
                        name: 'application_recommendations',
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
                        message: 'Document/Application not found',
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

    async findReviews(pk: number, query: any, user: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            const data = await dataSource
                .getRepository(Application)
                .createQueryBuilder('applications')
                .leftJoinAndSelect('applications.reviews', 'reviews')
                .leftJoinAndSelect('reviews.user', 'users')
                .leftJoinAndSelect('reviews.documents', 'documents as review_documents')
                .andWhere('applications.pk = :pk', { pk })
                .andWhere('reviews.type = :type', { type: query.type })
                .andWhere('reviews.archived = false')
                .orderBy('reviews.pk', 'ASC')
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

    async resolveReview(pk: number, review_pk: any, user: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                const review = await EntityManager.update(Review, { pk: review_pk }, { resolved: true });

                // save logs
                const model = {
                    pk: review_pk,
                    name: 'reviews',
                    status: 'resolved',
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

    async deleteApplicationAttachment(pk: number, document_pk: any, user: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                await EntityManager.query(
                    'delete from document_application_relation where document_pk = $1 and application_pk = $2;',
                    [document_pk, pk],
                );

                const review = await EntityManager.update(Document, { pk: document_pk }, { archived: true });

                // save logs
                const model = {
                    pk: document_pk,
                    name: 'documents',
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

    async deleteReviewAttachment(pk: number, review_pk: any, document_pk: any, user: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                await EntityManager.query(
                    'delete from document_review_relation where document_pk = $1 and review_pk = $2;',
                    [document_pk, review_pk],
                );

                const review = await EntityManager.update(Document, { pk: document_pk }, { archived: true });

                // save logs
                const model = {
                    pk: pk,
                    review_pk: review_pk,
                    document_pk: document_pk,
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

    async sendSuccessEmail(pk: number) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                const data = await this.find({ pk });
                const application = data.data;

                if (!application.status) {
                    const query = await Application.findOneBy({
                        pk: application.pk,
                    });
                    query.status = 'Received Proposals';
                    query.save();
                }

                if (!application.email_sent) {

                    const partner = await dataSource
                        .getRepository(Partner)
                        .createQueryBuilder('partners')
                        .select('partners')
                        .leftJoinAndSelect('partners.documents', 'documents')
                        .leftJoinAndSelect('partners.partner_organization', 'partner_organizations')
                        .leftJoinAndSelect('partner_organizations.country', 'countries')
                        .where('partners.pk = :pk', { pk: application.partner_pk })
                        .getOne();

                    // send email

                    const body = `<div style="width: 100%;">\
    <div style="width: 40%; float: left;">\
        <div>\
            <p>Proponent</p>\
            <h3>${partner.name}</h3>\
        </div>\
        <div>\
            <p>ID Number</p>\
            <h3>${partner.partner_id}</h3>\
        </div>\
        <div>\
            <p>Date of submission</p>\
            <h3>${DateTime.fromISO(application.date_created.toLocaleString()).toFormat('y-LL-dd HH:mm:ss')}</h3>\
        </div>\
    </div>\
    <div style="width: 60%; float: left; text-align: left;">\
        <div style="width: 100%;">\
            <div style="width: 50%; float: left;">\
                <div>\
                    <p>Grantee Project</p>\
                    <p>${application.project.title}</p>\
                </div>\
                <div>\
                    <p>Thematic Area</p>\
                    <p></p>\
                </div>\
                <div>\
                    <p>Country</p>\
                    <p>${partner['partner_organization']['country']['name']}</p>\
                </div>\
            </div>\
            <div style="width: 50%; float: left;">\
                <div>\
                    <p>Duration</p>\
                    <p>${application.project.duration}</p>\
                </div>\
                <div>\
                    <p>Local Currency</p>\
                    <p>${application.project.project_proposal.budget_request_other_currency}</p>\
                </div>\
                <div>\
                    <p>Amount Requested (USD)</p>\
                    <p>${application.project.project_proposal.budget_request_usd}</p>\
                </div>\
            </div>\
        </div>\
        <div style="width: 100%; text-align: center;">\
            <a href="http://3.0.54.110/public/application/${application.uuid}/status">http://3.0.54.110/public/${application.uuid}/status</a>\
        </div>\
    </div>\
</div>`; // MODIFY: must be a template from the database

                    const email = {
                        uuid: uuidv4(),
                        user_pk: application.created_by,
                        from: process.env.SEND_FROM,
                        from_name: process.env.SENDER,
                        to: partner.email_address,
                        to_name: '',
                        subject: 'Thank you for submitting your application',
                        body: body
                    }

                    // this.emailService.uuid = uuidv4();
                    // this.emailService.user_pk = application.created_by;
                    // this.emailService.from = process.env.SEND_FROM;
                    // this.emailService.from_name = process.env.SENDER;
                    // this.emailService.to = partner.email_address;
                    // this.emailService.to_name = '';
                    // this.emailService.subject = 'Thank you for submitting your application';
                    // this.emailService.body = body;
                    // await this.emailService.create();

                    await dataSource.manager
                        .getRepository(Email)
                        .createQueryBuilder('email')
                        .createQueryBuilder()
                        .insert()
                        .into(Email)
                        .values([
                            email
                        ])
                        .returning('pk')
                        .execute();

                    await EntityManager.update(Application, { pk: application.pk }, { email_sent: true });
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
