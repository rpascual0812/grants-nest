import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DateTime } from 'luxon';

import dataSource from 'db/data-source';
import { Application } from './entities/application.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
import { Document } from 'src/document/entities/document.entity';

@Injectable()
export class ApplicationService extends GlobalService {
    uuid: string;

    constructor(
        @InjectRepository(Application)
        private applicationRepository: Repository<Application>,
        private emailService: EmailService
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
                .where('applications.archived = false')
                .andWhere(
                    filters.hasOwnProperty('keyword') && filters.keyword != '' ?
                        "(partners.name ILIKE :keyword or partners.email_address ILIKE :keyword)" :
                        '1=1', { keyword: `%${filters.keyword}%` }
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
                .leftJoinAndSelect(
                    'projects.project_beneficiary',
                    'project_beneficiary',
                )
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
                .leftJoinAndSelect('applications.reviews', 'reviews')

                .leftJoinAndSelect("reviews.documents", "documents")
                .andWhere(filter.hasOwnProperty('pk') ? 'applications.pk = :pk' : '1=1', { pk: filter.pk })
                .andWhere(filter.hasOwnProperty('uuid') ? 'applications.uuid = :uuid' : '1=1', { uuid: filter.uuid })
                .andWhere(filter.hasOwnProperty('number') ? 'applications.number = :number' : '1=1', {
                    number: filter.number,
                })
                .andWhere('applications.archived = :archived', { archived: false })
                .orderBy("reviews.pk", "ASC")
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

    // async save(data: any, user: any) {
    //     const queryRunner = dataSource.createQueryRunner();
    //     await queryRunner.connect();

    //     try {
    //         return await queryRunner.manager.transaction(async (EntityManager) => {
    //             const application = await EntityManager.findOne(Application, {
    //                 where: { uuid: data.uuid },
    //                 relations: {
    //                     partner: true,
    //                 },
    //             });

    //             if (application) {
    //                 // Project Information
    //                 const applicationProjectInfo = new Project();
    //                 applicationProjectInfo.application_pk = application.pk;
    //                 applicationProjectInfo.title = data.project.title;
    //                 applicationProjectInfo.duration = data.project.duration;
    //                 applicationProjectInfo.background = data.project.background;
    //                 applicationProjectInfo.objective = data.project.objective;
    //                 applicationProjectInfo.expected_output = data.project.expected_output;
    //                 applicationProjectInfo.how_will_affect = data.project.how_will_affect;
    //                 const newProjectInfo = await EntityManager.save(applicationProjectInfo);

    //                 const womenType = data?.project?.beneficiary_women ?? [];
    //                 const tempWomenType = womenType.map(async (data) => {
    //                     const applicationProjInfoBeneficiaries = new ProjectBeneficiary();
    //                     applicationProjInfoBeneficiaries.project_pk = newProjectInfo.pk;
    //                     applicationProjInfoBeneficiaries.type = data.type;
    //                     applicationProjInfoBeneficiaries.name = data.name;
    //                     applicationProjInfoBeneficiaries.count = data.count;
    //                     const newApplicationProjInfoBeneficiaries = await EntityManager.save(
    //                         applicationProjInfoBeneficiaries,
    //                     );
    //                     return { ...newApplicationProjInfoBeneficiaries };
    //                 });
    //                 const savedWomenBeneficiary = await Promise.all(tempWomenType);

    //                 const youngWomenType = data?.project?.beneficiary_young_women ?? [];
    //                 const tempYoungWomenType = youngWomenType.map(async (data) => {
    //                     const applicationProjInfoBeneficiaries = new ProjectBeneficiary();
    //                     applicationProjInfoBeneficiaries.project_pk = newProjectInfo.pk;
    //                     applicationProjInfoBeneficiaries.type = data.type;
    //                     applicationProjInfoBeneficiaries.name = data.name;
    //                     applicationProjInfoBeneficiaries.count = data.count;
    //                     const newApplicationProjInfoBeneficiaries = await EntityManager.save(
    //                         applicationProjInfoBeneficiaries,
    //                     );
    //                     return { ...newApplicationProjInfoBeneficiaries };
    //                 });
    //                 const savedYoungWomenBeneficiary = await Promise.all(tempYoungWomenType);

    //                 const menType = data?.project?.beneficiary_men ?? [];
    //                 const tempMenType = menType.map(async (data) => {
    //                     const applicationProjInfoBeneficiaries = new ProjectBeneficiary();
    //                     applicationProjInfoBeneficiaries.project_pk = newProjectInfo.pk;
    //                     applicationProjInfoBeneficiaries.type = data.type;
    //                     applicationProjInfoBeneficiaries.name = data.name;
    //                     applicationProjInfoBeneficiaries.count = data.count;
    //                     const newApplicationProjInfoBeneficiaries = await EntityManager.save(
    //                         applicationProjInfoBeneficiaries,
    //                     );
    //                     return { ...newApplicationProjInfoBeneficiaries };
    //                 });
    //                 const savedMenBeneficiary = await Promise.all(tempMenType);

    //                 const youngMenType = data?.project?.beneficiary_young_men ?? [];
    //                 const tempYoungMenType = youngMenType.map(async (data) => {
    //                     const applicationProjInfoBeneficiaries = new ProjectBeneficiary();
    //                     applicationProjInfoBeneficiaries.project_pk = newProjectInfo.pk;
    //                     applicationProjInfoBeneficiaries.type = data.type;
    //                     applicationProjInfoBeneficiaries.name = data.name;
    //                     applicationProjInfoBeneficiaries.count = data.count;
    //                     const newApplicationProjInfoBeneficiaries = await EntityManager.save(
    //                         applicationProjInfoBeneficiaries,
    //                     );
    //                     return { ...newApplicationProjInfoBeneficiaries };
    //                 });
    //                 const savedYoungMenBeneficiary = await Promise.all(tempYoungMenType);

    //                 const projectLocations = data?.project?.project_locations ?? [];
    //                 const tempProjLoc = await projectLocations.map(async (data) => {
    //                     const applicationProjInfoProjLoc = new ProjectLocation();
    //                     applicationProjInfoProjLoc.project_pk = newProjectInfo.pk;
    //                     applicationProjInfoProjLoc.country_pk = data?.country_pk;
    //                     applicationProjInfoProjLoc.province_code = data?.province_code;
    //                     const newApplicationProjInfoProjLoc = await EntityManager.save(applicationProjInfoProjLoc);
    //                     return { ...newApplicationProjInfoProjLoc };
    //                 });
    //                 const savedProjLoc = await Promise.all(tempProjLoc);

    //                 // Proposed activities and timeline
    //                 const applicationProposal = new ApplicationProposal();
    //                 applicationProposal.application_pk = application.pk;
    //                 applicationProposal.monitor = data.proposal.monitor;
    //                 applicationProposal.budget_request_usd = data.proposal.budget_request_usd;
    //                 applicationProposal.budget_request_other = data.proposal.budget_request_other;
    //                 applicationProposal.budget_request_other_currency = data.proposal.budget_request_other_currency;
    //                 const saveProposal = await EntityManager.save(applicationProposal);

    //                 const activities = data?.proposal?.activities ?? [];
    //                 const tempActivities = await activities.map(async (data) => {
    //                     const proposalActivities = new ApplicationProposalActivity();
    //                     proposalActivities.application_proposal_pk = saveProposal.pk;
    //                     proposalActivities.name = data?.name;
    //                     proposalActivities.duration = data?.duration;
    //                     const newActivities = await EntityManager.save(proposalActivities);
    //                     return { ...newActivities };
    //                 });
    //                 const savedProposalActivities = await Promise.all(tempActivities);

    //                 // References
    //                 const references = data?.references ?? [];
    //                 const tempReferences = await references.map(async (data) => {
    //                     const applicationReference = new ApplicationReference();
    //                     applicationReference.application_pk = application.pk;
    //                     applicationReference.name = data?.name;
    //                     applicationReference.email_address = data?.email_address;
    //                     applicationReference.contact_number = data?.contact_number;
    //                     applicationReference.organization_name = data?.organization_name;
    //                     const newApplicationReferences = await EntityManager.save(applicationReference);
    //                     return { ...newApplicationReferences };
    //                 });
    //                 const savedReferences = await Promise.all(tempReferences);

    //                 this.emailService.uuid = uuidv4();
    //                 // if application, get created_by from applications table
    //                 // as application has no logged user
    //                 this.emailService.user_pk = application.created_by;
    //                 this.emailService.from = process.env.SEND_FROM;
    //                 this.emailService.from_name = process.env.SENDER;
    //                 this.emailService.to = application?.partner?.email_address;
    //                 this.emailService.to_name = '';
    //                 this.emailService.subject = 'We Have Received Your Application!';
    //                 this.emailService.body = 'RECEIVED'; // MODIFY: must be a template from the database

    //                 await this.emailService.create();

    //                 return {
    //                     status: true,
    //                     data: {
    //                         application,
    //                         project: {
    //                             ...newProjectInfo,
    //                             project_locations: [...savedProjLoc],
    //                             women_beneficiary: [...savedWomenBeneficiary],
    //                             young_women_beneficiary: [...savedYoungWomenBeneficiary],
    //                             men_beneficiary: [...savedMenBeneficiary],
    //                             young_men_beneficiary: [...savedYoungMenBeneficiary],
    //                         },
    //                         proposal: {
    //                             ...saveProposal,
    //                             activities: [...savedProposalActivities],
    //                         },
    //                         references: [...savedReferences],
    //                     },
    //                 };
    //             } else {
    //                 return {
    //                     status: false,
    //                     code: 500,
    //                     message: 'Application not found',
    //                 };
    //             }
    //         });
    //     } catch (err) {
    //         this.saveError({});
    //         console.log(err);
    //         return { status: false, code: err.code };
    //     } finally {
    //         await queryRunner.release();
    //     }
    // }

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
                    await EntityManager.update(Project, { application_pk: data.application_pk }, data.project);
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
                const appFiscalSponsorPk = data?.pk;
                const applicationPk = data?.application_pk;
                const existingFiscalSponsor = await EntityManager.findOne(ApplicationFiscalSponsor, {
                    where: {
                        pk: appFiscalSponsorPk,
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

    async saveNonProfitEquivalencyDetermination(data: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                const appNonProfitEquivalencyDeterminationPk = data?.pk;
                const applicationPk = data?.application_pk;
                const existingNonProfitEquivalencyDetermination = await EntityManager.findOne(
                    ApplicationNonprofitEquivalencyDetermination,
                    {
                        where: {
                            pk: appNonProfitEquivalencyDeterminationPk,
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

    async removeProjectLocation(pk: number, project_pk: number, location_pk: number, user: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                const location = await ProjectLocation.findOneBy({
                    pk: location_pk,
                });
                await location.remove();

                // save logs
                const model = {
                    application_pk: pk,
                    project_pk,
                    location_pk,
                    name: 'project_locations',
                    status: 'deleted',
                };
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

    async removeProposalActivity(pk: number, proposal_pk: number, activity_pk: number, user: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                const location = await ApplicationProposalActivity.findOneBy({
                    pk: activity_pk,
                });
                await location.remove();

                // save logs
                const model = {
                    application_pk: pk,
                    proposal_pk,
                    activity_pk,
                    name: 'application_proposal_activities',
                    status: 'deleted',
                };
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
                    // this is working but it only keep one record per application
                    // let application = await Application.findOneBy({
                    //     pk: data.application_pk
                    // });

                    // application.reviews = [review];
                    // application.save();

                    await EntityManager.query('insert into review_application_relation (review_pk, application_pk) values ($1 ,$2);', [newReview.pk, data.application_pk]);

                    return {
                        status: true,
                        data: newReview
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
}
