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
import { ApplicationProject } from './entities/application-project.entity';
import { ApplicationProjectLocation } from './entities/application-project-location.entity';
import { ApplicationProjectBeneficiary } from './entities/application-project-beneficiary.entity';
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
                .leftJoinAndSelect('applications.application_project', 'application_projects')
                .leftJoinAndSelect('application_projects.application_project_location', 'application_project_location')
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
                .leftJoinAndSelect('applications.application_project', 'application_projects')
                .leftJoinAndSelect('application_projects.application_project_location', 'application_project_location')
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
                .andWhere(filter.hasOwnProperty('pk') ? 'applications.pk = :pk' : '1=1', { pk: filter.pk })
                .andWhere(filter.hasOwnProperty('uuid') ? 'applications.uuid = :uuid' : '1=1', { uuid: filter.uuid })
                .andWhere(filter.hasOwnProperty('number') ? 'applications.number = :number' : '1=1', {
                    number: filter.number,
                })
                .andWhere('applications.archived = :archived', { archived: false })
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
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                const application = await EntityManager.findOne(Application, {
                    where: { uuid: data.uuid },
                    relations: {
                        partner: true,
                    },
                });

                if (application) {
                    // Project Information
                    const applicationProjectInfo = new ApplicationProject();
                    applicationProjectInfo.application_pk = application.pk;
                    applicationProjectInfo.title = data.project.title;
                    applicationProjectInfo.duration = data.project.duration;
                    applicationProjectInfo.background = data.project.background;
                    applicationProjectInfo.objective = data.project.objective;
                    applicationProjectInfo.expected_output = data.project.expected_output;
                    applicationProjectInfo.how_will_affect = data.project.how_will_affect;
                    const newApplicationProjectInfo = await EntityManager.save(applicationProjectInfo);

                    const womenType = data?.project?.beneficiary_women ?? [];
                    const tempWomenType = womenType.map(async (data) => {
                        const applicationProjInfoBeneficiaries = new ApplicationProjectBeneficiary();
                        applicationProjInfoBeneficiaries.application_project_pk = newApplicationProjectInfo.pk;
                        applicationProjInfoBeneficiaries.type = data.type;
                        applicationProjInfoBeneficiaries.name = data.name;
                        applicationProjInfoBeneficiaries.count = data.count;
                        const newApplicationProjInfoBeneficiaries = await EntityManager.save(
                            applicationProjInfoBeneficiaries,
                        );
                        return { ...newApplicationProjInfoBeneficiaries };
                    });
                    const savedWomenBeneficiary = await Promise.all(tempWomenType);

                    const youngWomenType = data?.project?.beneficiary_young_women ?? [];
                    const tempYoungWomenType = youngWomenType.map(async (data) => {
                        const applicationProjInfoBeneficiaries = new ApplicationProjectBeneficiary();
                        applicationProjInfoBeneficiaries.application_project_pk = newApplicationProjectInfo.pk;
                        applicationProjInfoBeneficiaries.type = data.type;
                        applicationProjInfoBeneficiaries.name = data.name;
                        applicationProjInfoBeneficiaries.count = data.count;
                        const newApplicationProjInfoBeneficiaries = await EntityManager.save(
                            applicationProjInfoBeneficiaries,
                        );
                        return { ...newApplicationProjInfoBeneficiaries };
                    });
                    const savedYoungWomenBeneficiary = await Promise.all(tempYoungWomenType);

                    const menType = data?.project?.beneficiary_men ?? [];
                    const tempMenType = menType.map(async (data) => {
                        const applicationProjInfoBeneficiaries = new ApplicationProjectBeneficiary();
                        applicationProjInfoBeneficiaries.application_project_pk = newApplicationProjectInfo.pk;
                        applicationProjInfoBeneficiaries.type = data.type;
                        applicationProjInfoBeneficiaries.name = data.name;
                        applicationProjInfoBeneficiaries.count = data.count;
                        const newApplicationProjInfoBeneficiaries = await EntityManager.save(
                            applicationProjInfoBeneficiaries,
                        );
                        return { ...newApplicationProjInfoBeneficiaries };
                    });
                    const savedMenBeneficiary = await Promise.all(tempMenType);

                    const youngMenType = data?.project?.beneficiary_young_men ?? [];
                    const tempYoungMenType = youngMenType.map(async (data) => {
                        const applicationProjInfoBeneficiaries = new ApplicationProjectBeneficiary();
                        applicationProjInfoBeneficiaries.application_project_pk = newApplicationProjectInfo.pk;
                        applicationProjInfoBeneficiaries.type = data.type;
                        applicationProjInfoBeneficiaries.name = data.name;
                        applicationProjInfoBeneficiaries.count = data.count;
                        const newApplicationProjInfoBeneficiaries = await EntityManager.save(
                            applicationProjInfoBeneficiaries,
                        );
                        return { ...newApplicationProjInfoBeneficiaries };
                    });
                    const savedYoungMenBeneficiary = await Promise.all(tempYoungMenType);

                    const projectLocations = data?.project?.project_locations ?? [];
                    const tempProjLoc = await projectLocations.map(async (data) => {
                        const applicationProjInfoProjLoc = new ApplicationProjectLocation();
                        applicationProjInfoProjLoc.application_project_pk = newApplicationProjectInfo.pk;
                        applicationProjInfoProjLoc.country_pk = data?.country_pk;
                        applicationProjInfoProjLoc.province_code = data?.province_code;
                        const newApplicationProjInfoProjLoc = await EntityManager.save(applicationProjInfoProjLoc);
                        return { ...newApplicationProjInfoProjLoc };
                    });
                    const savedProjLoc = await Promise.all(tempProjLoc);

                    // Proposed activities and timeline
                    const applicationProposal = new ApplicationProposal();
                    applicationProposal.application_pk = application.pk;
                    applicationProposal.monitor = data.proposal.monitor;
                    applicationProposal.budget_request_usd = data.proposal.budget_request_usd;
                    applicationProposal.budget_request_other = data.proposal.budget_request_other;
                    applicationProposal.budget_request_other_currency = data.proposal.budget_request_other_currency;
                    const saveProposal = await EntityManager.save(applicationProposal);

                    const activities = data?.proposal?.activities ?? [];
                    const tempActivities = await activities.map(async (data) => {
                        const proposalActivities = new ApplicationProposalActivity();
                        proposalActivities.application_proposal_pk = saveProposal.pk;
                        proposalActivities.name = data?.name;
                        proposalActivities.duration = data?.duration;
                        const newActivities = await EntityManager.save(proposalActivities);
                        return { ...newActivities };
                    });
                    const savedProposalActivities = await Promise.all(tempActivities);

                    // Fiscal Sponsor
                    const applicationFiscalSponsor = new ApplicationFiscalSponsor();
                    applicationFiscalSponsor.application_pk = application.pk;
                    applicationFiscalSponsor.name = data.fiscal_sponsor.name;
                    applicationFiscalSponsor.address = data.fiscal_sponsor.address;
                    applicationFiscalSponsor.head = data.fiscal_sponsor.head;
                    applicationFiscalSponsor.person_in_charge = data.fiscal_sponsor.person_in_charge;
                    applicationFiscalSponsor.contact_number = data.fiscal_sponsor.contact_number;
                    applicationFiscalSponsor.email_address = data.fiscal_sponsor.email_address;
                    applicationFiscalSponsor.bank_account_name = data.fiscal_sponsor.bank_account_name;
                    applicationFiscalSponsor.account_number = data.fiscal_sponsor.account_number;
                    applicationFiscalSponsor.bank_name = data.fiscal_sponsor.bank_name;
                    applicationFiscalSponsor.bank_branch = data.fiscal_sponsor.bank_branch;
                    applicationFiscalSponsor.bank_address = data.fiscal_sponsor.bank_address;
                    const newApplicationFiscalSponsor = await EntityManager.save(applicationFiscalSponsor);

                    // Non-Profit Equivalency Determination
                    const applicationNonProfitEquivalencyDetermination =
                        new ApplicationNonprofitEquivalencyDetermination();
                    applicationNonProfitEquivalencyDetermination.application_pk = application.pk;
                    applicationNonProfitEquivalencyDetermination.year = data.non_profit_equivalency_determination.year;

                    applicationNonProfitEquivalencyDetermination.financial_last_year_usd =
                        data.non_profit_equivalency_determination.financial_last_year_usd;
                    applicationNonProfitEquivalencyDetermination.financial_last_year_other =
                        data.non_profit_equivalency_determination.financial_last_year_other;
                    applicationNonProfitEquivalencyDetermination.financial_last_year_other_currency =
                        data.non_profit_equivalency_determination.financial_last_year_other_currency;
                    applicationNonProfitEquivalencyDetermination.financial_last_year_source =
                        data.non_profit_equivalency_determination.financial_last_year_source;

                    applicationNonProfitEquivalencyDetermination.financial_current_usd =
                        data.non_profit_equivalency_determination.financial_current_usd;
                    applicationNonProfitEquivalencyDetermination.financial_current_other =
                        data.non_profit_equivalency_determination.financial_current_other;
                    applicationNonProfitEquivalencyDetermination.financial_current_other_currency =
                        data.non_profit_equivalency_determination.financial_current_other_currency;
                    applicationNonProfitEquivalencyDetermination.financial_current_source =
                        data.non_profit_equivalency_determination.financial_current_source;

                    applicationNonProfitEquivalencyDetermination.officers =
                        data.non_profit_equivalency_determination.officers;
                    applicationNonProfitEquivalencyDetermination.members =
                        data.non_profit_equivalency_determination.members;

                    applicationNonProfitEquivalencyDetermination.operated_for_others =
                        data.non_profit_equivalency_determination.operated_for_others;

                    applicationNonProfitEquivalencyDetermination.any_assets =
                        data.non_profit_equivalency_determination.any_assets;
                    applicationNonProfitEquivalencyDetermination.any_assets_description =
                        data.non_profit_equivalency_determination.any_assets_description;
                    applicationNonProfitEquivalencyDetermination.any_payments =
                        data.non_profit_equivalency_determination.any_payments;
                    applicationNonProfitEquivalencyDetermination.any_payments_description =
                        data.non_profit_equivalency_determination.any_payments_description;
                    applicationNonProfitEquivalencyDetermination.upon_dissolution =
                        data.non_profit_equivalency_determination.upon_dissolution;
                    applicationNonProfitEquivalencyDetermination.is_controlled_by =
                        data.non_profit_equivalency_determination.is_controlled_by;

                    applicationNonProfitEquivalencyDetermination.operated_for =
                        data.non_profit_equivalency_determination.operated_for;

                    const newApplicationNonProfitEquivalencyDetermination = await EntityManager.save(
                        applicationNonProfitEquivalencyDetermination,
                    );

                    // References
                    const references = data?.references ?? [];
                    const tempReferences = await references.map(async (data) => {
                        const applicationReference = new ApplicationReference();
                        applicationReference.application_pk = application.pk;
                        applicationReference.name = data?.name;
                        applicationReference.email_address = data?.email_address;
                        applicationReference.contact_number = data?.contact_number;
                        applicationReference.organization_name = data?.organization_name;
                        const newApplicationReferences = await EntityManager.save(applicationReference);
                        return { ...newApplicationReferences };
                    });
                    const savedReferences = await Promise.all(tempReferences);

                    this.emailService.uuid = uuidv4();
                    // if application, get created_by from applications table
                    // as application has no logged user
                    this.emailService.user_pk = application.created_by;
                    this.emailService.from = process.env.SEND_FROM;
                    this.emailService.from_name = process.env.SENDER;
                    this.emailService.to = application?.partner?.email_address;
                    this.emailService.to_name = '';
                    this.emailService.subject = 'We Have Received Your Application!';
                    this.emailService.body = 'RECEIVED'; // MODIFY: must be a template from the database

                    await this.emailService.create();

                    return {
                        status: true,
                        data: {
                            application,
                            project: {
                                ...newApplicationProjectInfo,
                                project_locations: [...savedProjLoc],
                                women_beneficiary: [...savedWomenBeneficiary],
                                young_women_beneficiary: [...savedYoungWomenBeneficiary],
                                men_beneficiary: [...savedMenBeneficiary],
                                young_men_beneficiary: [...savedYoungMenBeneficiary],
                            },
                            proposal: {
                                ...saveProposal,
                                activities: [...savedProposalActivities],
                            },
                            fiscal_sponsor: {
                                ...newApplicationFiscalSponsor,
                            },
                            non_profit_equivalency_determination: {
                                ...newApplicationNonProfitEquivalencyDetermination,
                            },
                            references: [...savedReferences],
                        },
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
                const location = await ApplicationProjectLocation.findOneBy({
                    pk: location_pk,
                });
                await location.remove();

                // save logs
                const model = {
                    application_pk: pk,
                    project_pk,
                    location_pk,
                    name: 'application_project_locations',
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
}
