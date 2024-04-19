import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, Req } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApplicationQueryHelpersService } from './utilities/lib/application-query-helpers/application-query-helpers.service';

@Controller('application')
export class ApplicationController {
    constructor(
        private readonly applicationService: ApplicationService,
        private readonly applicationQueryHelpersService: ApplicationQueryHelpersService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post('generate')
    generate(@Body() body: any, @Request() req: any) {
        return this.applicationService.generate(body, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    save(@Body() body: any, @Request() req: any) {
        return this.applicationService.save(body, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('partner')
    savePartner(@Body() body: any, @Request() req: any) {
        return this.applicationService.savePartner(body, req.user);
    }

    // @UseGuards(JwtAuthGuard)
    @Post('partner_organization')
    savePartnerOrg(@Body() body: any) {
        return this.applicationService.savePartnerOrg(body);
    }

    // @UseGuards(JwtAuthGuard)
    @Post('project')
    saveProject(@Body() body: any) {
        return this.applicationService.saveProject(body);
    }

    // @UseGuards(JwtAuthGuard)
    @Post('proposal')
    saveProposal(@Body() body: any) {
        return this.applicationService.saveProposal(body);
    }

    // @UseGuards(JwtAuthGuard)
    @Post('fiscal_sponsor')
    saveFiscalSponsor(@Body() body: any) {
        return this.applicationService.saveFiscalSponsor(body);
    }

    // @UseGuards(JwtAuthGuard)
    @Post('nonprofit_equivalency_determination')
    saveNonProfitEquivalencyDetermination(@Body() body: any) {
        return this.applicationService.saveNonProfitEquivalencyDetermination(body);
    }

    // @UseGuards(JwtAuthGuard)
    @Post('reference')
    saveReference(@Body() body: any) {
        return this.applicationService.saveReference(body);
    }

    @UseGuards(JwtAuthGuard)
    @Post('organization_bank_account')
    saveOrganizationBankAccount(@Body() body: any, @Request() req: any) {
        return this.applicationService.saveOrganizationBankAccount(body, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('organization_other_information')
    saveOrganizationOtherInfo(@Body() body: any, @Request() req: any) {
        return this.applicationService.saveOrganizationOtherInfo(body, req.user);
    }

    @Post(':pk/success/email')
    sendSuccessEmail(@Param('pk') pk: number) {
        return this.applicationService.sendSuccessEmail(pk);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    fetch(@Request() req: any) {
        return this.applicationService.findAll(req.query);
    }

    // @UseGuards(JwtAuthGuard)
    @Get(':pk')
    fetchOne(@Param('pk') pk: string) {
        return this.applicationService.find({ pk });
    }

    @Get(':uuid/generated')
    async generated(@Param('uuid') uuid: string) {
        const application: any = await this.applicationService.find({ uuid });
        // partner
        const partner = await this.applicationQueryHelpersService.getPartner(application);
        application.data['partner'] = partner;

        // partner organization
        const partnerOrganization = await this.applicationQueryHelpersService.getPartnerOrganization(application);
        application.data['partner']['organization'] = partnerOrganization;

        // partner contacts
        const partnerContacts = await this.applicationQueryHelpersService.getPartnerContacts(application);
        application.data['partner']['partner_contacts'] = partnerContacts;

        // partner fiscal sponsor
        const partnerFiscalSponsor = await this.applicationQueryHelpersService.getPartnerFiscalSponsor(application);
        application.data['partner']['partner_fiscal_sponsor'] = partnerFiscalSponsor;

        // partner non-profit equivalency determination
        const partnerNonprofitEquivalencyDetermination =
            await this.applicationQueryHelpersService.getPartnerNonProfitEquivalencyDetermination(application);
        application.data['partner']['partner_nonprofit_equivalency_determination'] =
            partnerNonprofitEquivalencyDetermination;

        return application;
    }

    @UseGuards(JwtAuthGuard)
    @Get(':number/review')
    async review(@Param('number') number: string, @Request() req: any) {
        const application: any = await this.applicationService.find({ number, reviews: req.query.reviews });

        const partner = await this.applicationService.getPartner(application.data.partner_pk);
        if (!application.data.hasOwnProperty('partner')) {
            application.data['partner'] = {};
        }
        application.data['partner'] = partner;

        // partner organization
        const partner_organizations = await this.applicationService.getPartnerOrganization(
            application.data['partner'].pk,
        );
        if (!application.data['partner'].hasOwnProperty('organization')) {
            application.data['partner']['organization'] = {};
        }
        application.data['partner']['organization'] = partner_organizations;

        const partner_contacts = await this.applicationService.getPartnerContacts(application.data['partner'].pk);
        if (!application.data['partner'].hasOwnProperty('partner_contacts')) {
            application.data['partner']['partner_contacts'] = {};
        }
        application.data['partner']['partner_contacts'] = partner_contacts;

        const partner_fiscal_sponsor = await this.applicationService.getPartnerFiscalSponsor(
            application.data['partner'].pk,
        );
        if (!application.data['partner'].hasOwnProperty('partner_fiscal_sponsor')) {
            application.data['partner']['partner_fiscal_sponsor'] = {};
        }
        application.data['partner']['partner_fiscal_sponsor'] = partner_fiscal_sponsor;

        const partner_nonprofit_equivalency_determination =
            await this.applicationService.getPartnerNonprofitEquivalencyDetermination(application.data['partner'].pk);
        if (!application.data['partner'].hasOwnProperty('partner_nonprofit_equivalency_determination')) {
            application.data['partner']['partner_nonprofit_equivalency_determination'] = {};
        }
        application.data['partner']['partner_nonprofit_equivalency_determination'] =
            partner_nonprofit_equivalency_determination;

        const applicationReviews = await this.applicationService.getReviews(application.data.pk);
        if (!application.data.hasOwnProperty('reviews')) {
            application.data['reviews'] = {};
        }
        application.data['reviews'] = applicationReviews['reviews'];

        return application;
    }

    @UseGuards(JwtAuthGuard)
    @Get(':pk/reviews')
    reviews(@Param('pk') pk: number, @Request() req: any) {
        return this.applicationService.findReviews(pk, req.query, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':pk')
    remove(@Param('pk') pk: number, @Request() req: any) {
        console.log('deleting', pk);
        return this.applicationService.remove(+pk, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('project/:project_pk/location/:location_pk')
    removeProjectLocation(
        @Param('project_pk') project_pk: number,
        @Param('location_pk') location_pk: number,
        @Request() req: any,
    ) {
        return this.applicationService.removeProjectLocation(+project_pk, +location_pk, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('proposal/:proposal_pk/activity/:activity_pk')
    removeProposalActivity(
        @Param('proposal_pk') proposal_pk: number,
        @Param('activity_pk') activity_pk: number,
        @Request() req: any,
    ) {
        return this.applicationService.removeProposalActivity(+proposal_pk, +activity_pk, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('review')
    saveReview(@Body() body: any, @Request() req: any) {
        return this.applicationService.saveReview(body, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('review/:pk')
    deleteReview(@Param('pk') pk: number, @Request() req: any) {
        return this.applicationService.deleteReview(pk, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('type')
    saveType(@Body() body: any) {
        return this.applicationService.saveType(body);
    }

    @UseGuards(JwtAuthGuard)
    @Post('attachment')
    saveAttachment(@Body() body: any, @Request() req: any) {
        return this.applicationService.saveAttachment(body, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('recommendation')
    saveRecommendation(@Body() body: any, @Request() req: any) {
        return this.applicationService.saveRecommendation(body, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':pk/review/:review_pk/resolve')
    resolveReview(@Param('pk') application_pk: number, @Param('review_pk') review_pk: number, @Request() req: any) {
        return this.applicationService.resolveReview(application_pk, review_pk, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':pk/document/:document_pk')
    deleteApplicationAttachment(
        @Param('pk') application_pk: number,
        @Param('document_pk') document_pk: number,
        @Request() req: any,
    ) {
        return this.applicationService.deleteApplicationAttachment(application_pk, document_pk, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':pk/review/:review_pk/document/:document_pk')
    deleteReviewAttachment(
        @Param('pk') application_pk: number,
        @Param('review_pk') review_pk: number,
        @Param('document_pk') document_pk: number,
        @Request() req: any,
    ) {
        return this.applicationService.deleteReviewAttachment(application_pk, review_pk, document_pk, req.user);
    }
}
