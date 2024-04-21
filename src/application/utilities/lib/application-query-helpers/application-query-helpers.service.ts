import { ApplicationService } from './../../../application.service';
import { Injectable } from '@nestjs/common';

type TODO = any;

@Injectable()
export class ApplicationQueryHelpersService {
    constructor(private applicationService: ApplicationService) {}

    async getPartner(partnerPks: number[]) {
        const partner = await this.applicationService.getPartner(partnerPks);
        return partner ?? {};
    }

    async getPartnerOrganization(partnerPks: number[]) {
        const partnerOrganization = await this.applicationService.getPartnerOrganization(partnerPks);
        return partnerOrganization ?? {};
    }

    async getPartnerContacts(partnerPks: number[]) {
        const partnerContacts = await this.applicationService.getPartnerContacts(partnerPks);
        return partnerContacts ?? {};
    }

    async getPartnerFiscalSponsor(partnerPks: number[]) {
        const partnerFiscalSponsor = await this.applicationService.getPartnerFiscalSponsor(partnerPks);
        return partnerFiscalSponsor ?? {};
    }

    async getPartnerNonProfitEquivalencyDetermination(partnerPks: number[]) {
        const partnerNonProfitEquivalencyDetermination =
            await this.applicationService.getPartnerNonprofitEquivalencyDetermination(partnerPks);
        return partnerNonProfitEquivalencyDetermination ?? {};
    }

    async getApplicationReviews(partnerPks: number[]) {
        const applicationReviews = await this.applicationService.getReviews(partnerPks);
        return applicationReviews ?? {};
    }
}
