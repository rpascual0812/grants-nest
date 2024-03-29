import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DateTime } from 'luxon';

import dataSource from 'db/data-source';
import { Application } from './entities/application.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, Equal } from 'typeorm';
import { ApplicationProponent } from './entities/application-proponent.entity';
import { ApplicationOrganizationProfile } from './entities/application-organization-profile.entity';
import { GlobalService } from 'src/utilities/global.service';
import { Log } from 'src/log/entities/log.entity';
import { ApplicationReference } from './entities/application-references.entity';
import { ApplicationProposal } from './entities/application-proposal.entity';
import { ApplicationProposalActivity } from './entities/application-proposal-activity.entity';
import { ApplicationFiscalSponsor } from './entities/application-fiscal-sponsor.entity';
import { ApplicationNonprofitEquivalencyDetermination } from './entities/application-nonprofit-equivalency-determination.entity';
import { ApplicationProponentContact } from './entities/application-proponent-contact.entity';
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

@Injectable()
export class ApplicationService extends GlobalService {
    uuid: string;

    constructor(
        @InjectRepository(Application)
        private applicationRepository: Repository<Application>,
        private emailService: EmailService,
    ) {
        super();
    }

    async findAll(filters: any) {
        try {
            const data = await dataSource.manager
                .getRepository(Application)
                .createQueryBuilder('applications')
                .leftJoinAndSelect('applications.partner', 'partners')
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
                .leftJoinAndSelect('applications.project', 'projects')
                .leftJoinAndSelect('projects.project_beneficiary', 'project_beneficiary')
                .leftJoinAndSelect('projects.project_location', 'project_location')
                .leftJoinAndSelect('applications.application_proposal', 'application_proposal')
                .leftJoinAndSelect(
                    'application_proposal.application_proposal_activity',
                    'application_proposal_activity',
                )
                .leftJoinAndSelect('applications.application_fiscal_sponsor', 'application_fiscal_sponsor')
                .leftJoinAndSelect(
                    'applications.application_nonprofit_equivalency_determination',
                    'application_nonprofit_equivalency_determination',
                )
                .leftJoinAndSelect('applications.application_reference', 'application_reference')
                .leftJoinAndSelect('applications.reviews', 'review_application_relation')
                .leftJoinAndSelect('applications.types', 'type_application_relation')
                .where('applications.archived = false')
                .andWhere(
                    filters.hasOwnProperty('keyword') && filters.keyword != ''
                        ? '(partners.name ILIKE :keyword or partners.email_address ILIKE :keyword)'
                        : '1=1',
                    { keyword: `%${filters.keyword}%` },
                )
                .andWhere(
                    filters.hasOwnProperty('type_pk') && filters?.type_pk && filters?.type_pk?.trim() !== ''
                        ? 'type_application_relation.pk = :type_pk'
                        : '1=1',
                    {
                        type_pk: +filters.type_pk,
                    },
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

    async find(filter: any) {
        try {
            const data = await dataSource
                .getRepository(Application)
                .createQueryBuilder('applications')
                .leftJoinAndSelect('applications.partner', 'partners')
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
                .leftJoinAndSelect('applications.project', 'projects')
                .leftJoinAndSelect('projects.project_location', 'project_location')
                .leftJoinAndSelect('projects.project_beneficiary', 'project_beneficiary')
                .leftJoinAndSelect('applications.application_proposal', 'application_proposal')
                .leftJoinAndSelect(
                    'application_proposal.application_proposal_activity',
                    'application_proposal_activity',
                )
                .leftJoinAndSelect('applications.application_fiscal_sponsor', 'application_fiscal_sponsor')
                .leftJoinAndSelect(
                    'applications.application_nonprofit_equivalency_determination',
                    'application_nonprofit_equivalency_determination',
                )
                .leftJoinAndSelect('applications.application_reference', 'application_reference')

                .leftJoinAndSelect('applications.documents', 'documents')
                .leftJoinAndSelect('applications.reviews', 'reviews')
                .leftJoinAndSelect('reviews.user', 'users')
                .leftJoinAndSelect('reviews.documents', 'documents as review_documents')
                .leftJoinAndSelect('applications.types', 'types')
                .leftJoinAndSelect('applications.recommendations', 'application_recommendations')
                .andWhere(filter.hasOwnProperty('pk') ? 'applications.pk = :pk' : '1=1', { pk: filter.pk })
                .andWhere(filter.hasOwnProperty('uuid') ? 'applications.uuid = :uuid' : '1=1', { uuid: filter.uuid })
                .andWhere(filter.hasOwnProperty('number') ? 'applications.number = :number' : '1=1', {
                    number: filter.number,
                })
                .andWhere('applications.archived = :archived', { archived: false })
                .andWhere('reviews.archived = false')
                .orderBy('reviews.pk', 'ASC')
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

                const application = this.applicationRepository.create(obj);

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

                return this.applicationRepository.save(application);
            });
        } catch (err) {
            this.saveError(err);
            return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }
    }

    async save(data: any, user: any) {
        console.log(data, user);
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

    async savePartner(data: any) {
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
                const partner = existingPartner ? existingPartner : new Partner();
                partner.partner_id = getDefaultValue(partner_id, existingPartner?.partner_id);
                partner.name = getDefaultValue(data?.name, existingPartner?.name);
                partner.email_address = getDefaultValue(data?.email_address, existingPartner?.email_address);
                partner.address = getDefaultValue(data?.address, existingPartner?.address);
                partner.contact_number = getDefaultValue(data?.contact_number, existingPartner?.contact_number);
                partner.website = getDefaultValue(data?.website, existingPartner?.website);
                const savedPartner = await EntityManager.save(Partner, {
                    ...partner,
                });

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
                    data?.contacts?.at(0).contact_number,
                    existingContact?.contact_number,
                );
                partnerContact.email_address = getDefaultValue(
                    data?.contacts?.at(0).email_address,
                    existingContact?.email_address,
                );
                if (existingContact || data?.contacts?.length > 0) {
                    savedPartnerContacts = await EntityManager.save(PartnerContact, {
                        ...partnerContact,
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
            this.saveError({});
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
                const appFiscalSponsorPk = getParsedPk(data?.pk);
                const applicationPk = data?.application_pk;
                const existingFiscalSponsor = await EntityManager.findOne(ApplicationFiscalSponsor, {
                    where: {
                        pk: Equal(appFiscalSponsorPk),
                    },
                });

                const fiscalSponsor = existingFiscalSponsor ? existingFiscalSponsor : new ApplicationFiscalSponsor();
                fiscalSponsor.application_pk = applicationPk;
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

                const savedFiscalSponsor = await EntityManager.save(ApplicationFiscalSponsor, {
                    ...fiscalSponsor,
                });

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
            return await queryRunner.manager.transaction(async (EntityManager) => {
                const appProjectPk = getParsedPk(data?.pk);
                console.log(
                    '🚀 ~ ApplicationService ~ returnawaitqueryRunner.manager.transaction ~ data?.pk:',
                    data?.pk,
                );
                console.log(
                    '🚀 ~ ApplicationService ~ returnawaitqueryRunner.manager.transaction ~ appProjectPk:',
                    appProjectPk,
                );
                const applicationPk = data?.application_pk;
                const existingProject = await EntityManager.findOne(Project, {
                    where: {
                        pk: Equal(appProjectPk),
                    },
                });

                const project = existingProject ? existingProject : new Project();
                project.application_pk = applicationPk;
                project.title = getDefaultValue(data?.title, existingProject?.title);
                project.duration = getDefaultValue(data?.duration, existingProject?.duration);
                project.background = getDefaultValue(data?.background, existingProject?.background);
                project.objective = getDefaultValue(data?.objective, existingProject?.objective);
                project.expected_output = getDefaultValue(data?.expected_output, existingProject?.expected_output);
                project.how_will_affect = getDefaultValue(data?.how_will_affect, existingProject?.how_will_affect);
                project.status_pk = getDefaultValue(data?.status_pk, existingProject?.status_pk);
                project.type_pk = getDefaultValue(data?.type_pk, existingProject?.type_pk);

                const savedProject = await EntityManager.save(Project, {
                    ...project,
                });

                let savedProjLoc = [];
                const projLoc = data?.project_location ?? [];

                const resProj: any = await this.saveProjLocation({
                    project_pk: appProjectPk ?? savedProject?.pk,
                    project_location: projLoc,
                });
                savedProjLoc = resProj?.data?.project_location;

                let savedProjBeneficiary = [];
                const projBeneficiary = data?.project_beneficiary ?? [];
                const resBeneficiary: any = await this.saveProjBeneficiary({
                    project_pk: appProjectPk ?? savedProject?.pk,
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
            });
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
            return await queryRunner.manager.transaction(async (EntityManager) => {
                const appProposalPk = getParsedPk(data?.pk);
                const applicationPk = data?.application_pk;
                const existingProposal = await EntityManager.findOne(ApplicationProposal, {
                    where: {
                        pk: Equal(appProposalPk),
                    },
                });

                const proposal = existingProposal ? existingProposal : new ApplicationProposal();
                proposal.application_pk = applicationPk;
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

                const savedProposal = await EntityManager.save(ApplicationProposal, {
                    ...proposal,
                });

                let savedProposalAct = [];
                const proposalActivity = data?.application_proposal_activity ?? [];
                const resProposalAct: any = await this.saveProposalActivity({
                    application_proposal_pk: appProposalPk ?? savedProposal?.pk,
                    application_proposal_activity: proposalActivity,
                });
                savedProposalAct = resProposalAct?.data?.application_proposal_activity;

                return {
                    status: true,
                    data: {
                        ...savedProposal,
                        application_proposal_activity: savedProposalAct,
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

    async saveProposalActivity(data: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                const appProposalPk = data?.application_proposal_pk;
                const proposalActivity = data?.application_proposal_activity ?? [];

                const tmpProposalAct = proposalActivity?.map(async (item) => {
                    const proposalPk = getParsedPk(item?.pk);
                    const existingProposalActivity = await EntityManager.findOneBy(ApplicationProposalActivity, {
                        pk: Equal(proposalPk),
                        application_proposal_pk: Equal(appProposalPk),
                    });

                    const activity = existingProposalActivity
                        ? existingProposalActivity
                        : new ApplicationProposalActivity();

                    activity.application_proposal_pk = appProposalPk;
                    activity.name = item.name;
                    activity.duration = item.duration;

                    const savedItem = await EntityManager.save(ApplicationProposalActivity, {
                        ...activity,
                    });

                    return {
                        ...savedItem,
                    };
                });

                await Promise.all(tmpProposalAct);

                const existingAppProposalAct =
                    (await EntityManager.findBy(ApplicationProposalActivity, {
                        application_proposal_pk: Equal(appProposalPk),
                    })) ?? [];

                const allItem = [...existingAppProposalAct];

                return {
                    status: true,
                    data: {
                        application_proposal_activity: allItem,
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
                const applicationPk = data?.application_pk;
                const existingNonProfitEquivalencyDetermination = await EntityManager.findOne(
                    ApplicationNonprofitEquivalencyDetermination,
                    {
                        where: {
                            pk: Equal(appNonProfitEquivalencyDeterminationPk),
                        },
                    },
                );

                const nonProfitEquivalencyDetermination = existingNonProfitEquivalencyDetermination
                    ? existingNonProfitEquivalencyDetermination
                    : new ApplicationNonprofitEquivalencyDetermination();

                nonProfitEquivalencyDetermination.application_pk = applicationPk;
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
                    ApplicationNonprofitEquivalencyDetermination,
                    {
                        ...nonProfitEquivalencyDetermination,
                    },
                );

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

    async saveReference(data: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                const appPk = data?.application_pk;
                const appReference = data?.application_reference ?? [];

                const tmpReference = appReference?.map(async (item) => {
                    const referencePk = getParsedPk(item?.pk);
                    const existingReference = await EntityManager.findOneBy(ApplicationReference, {
                        pk: Equal(referencePk),
                        application_pk: Equal(appPk),
                    });

                    const reference = existingReference ? existingReference : new ApplicationReference();

                    reference.application_pk = appPk;
                    reference.name = getDefaultValue(item?.name, existingReference?.name);
                    reference.contact_number = getDefaultValue(item?.contact_number, existingReference?.contact_number);
                    reference.email_address = getDefaultValue(item?.email_address, existingReference?.email_address);
                    reference.organization_name = getDefaultValue(
                        item?.organization_name,
                        existingReference?.organization_name,
                    );
                    const savedItem = await EntityManager.save(ApplicationReference, {
                        ...reference,
                    });

                    return {
                        ...savedItem,
                    };
                });

                await Promise.all(tmpReference);

                const existingAppReference =
                    (await EntityManager.findBy(ApplicationReference, {
                        application_pk: Equal(appPk),
                    })) ?? [];

                const allItem = [...existingAppReference];

                return {
                    status: true,
                    data: {
                        application_reference: allItem,
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
                // const model = {
                //     project_pk,
                //     location_pk,
                //     name: 'project_locations',
                //     status: 'deleted',
                // };

                // await this.saveLog({ model, user });

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
                const activity = await ApplicationProposalActivity.findOneBy({
                    pk: Equal(activity_pk),
                });
                await activity.remove();

                // save logs
                // const model = {
                //     application_pk: pk,
                //     proposal_pk,
                //     activity_pk,
                //     name: 'application_proposal_activities',
                //     status: 'deleted',
                // };
                // await this.saveLog({ model, user });

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
                review.flag = data.flag;
                review.type = data.type;
                review.created_by = user.pk;
                review.documents = data.documents;
                const newReview = await dataSource.manager.save(review);

                if (newReview) {
                    // this is working but it only keeps one record per application
                    // let application = await Application.findOneBy({
                    //     pk: data.application_pk
                    // });

                    // application.reviews = [review];
                    // application.save();

                    await EntityManager.query(
                        'insert into review_application_relation (review_pk, application_pk) values ($1 ,$2);',
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
                        'insert into type_application_relation (type_pk, application_pk) values ($1 ,$2);',
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
                        'insert into document_application_relation (document_pk, application_pk) values ($1 ,$2);',
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
}
