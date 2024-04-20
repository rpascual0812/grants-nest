import { ApplicationService } from './../../../application.service';
import { Injectable } from '@nestjs/common';

type TODO = any;

@Injectable()
export class ApplicationQueryHelpersService {
    constructor(private applicationService: ApplicationService) { }

    async getPartner(application: TODO) {
        const partner = await this.applicationService.getPartner([application.data.partner_pk]);
        return partner ?? {};
    }

    async getPartnerOrganization(application: TODO) {
        const partnerOrganization = await this.applicationService.getPartnerOrganization(
            [application?.data?.['partner']?.pk]
        );
        return partnerOrganization ?? {};
    }

    async getPartnerContacts(application: TODO) {
        const partnerContacts = await this.applicationService.getPartnerContacts([application?.data?.['partner']?.pk]);
        return partnerContacts ?? {};
    }

    async getPartnerFiscalSponsor(application: TODO) {
        const partnerFiscalSponsor = await this.applicationService.getPartnerFiscalSponsor(
            [application?.data?.['partner']?.pk]
        );
        return partnerFiscalSponsor ?? {};
    }

    async getPartnerNonProfitEquivalencyDetermination(application: TODO) {
        const partnerNonProfitEquivalencyDetermination =
            await this.applicationService.getPartnerNonprofitEquivalencyDetermination(
                [application?.data?.['partner']?.pk]
            );
        return partnerNonProfitEquivalencyDetermination ?? {};
    }

    async getApplicationReviews(application: TODO) {
        const applicationReviews = await this.applicationService.getReviews([application?.data?.pk]);
        return applicationReviews ?? {};
    }
}
