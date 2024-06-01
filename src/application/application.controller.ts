import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, Req } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApplicationQueryHelpersService } from './utilities/lib/application-query-helpers/application-query-helpers.service';
import { ProjectsService } from 'src/projects/projects.service';

@Controller('application')
export class ApplicationController {
    constructor(
        private readonly applicationService: ApplicationService,
        private readonly projectService: ProjectsService,
        private readonly applicationQueryHelpersService: ApplicationQueryHelpersService,
    ) { }

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

    // @UseGuards(JwtAuthGuard)
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

    @Post(':pk/email')
    sendEmail(@Param('pk') pk: number, @Body() body: any) {
        return this.applicationService.sendEmail(body);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async fetch(@Request() req: any) {
        let applications: any = await this.applicationService.findAll(req.query);
        if (applications.data.length > 0) {
            const pks = applications.data.map((application) => application.pk);
            const partner_pks = applications.data.map((application) => application.partner_pk);

            // Partner
            const partners: any = await this.applicationService.getPartner(partner_pks);

            // Partner Organization
            const partner_organizations: any = await this.applicationService.getPartnerOrganization(partner_pks);

            // Partner Contacts
            const partner_contacts: any = await this.applicationService.getPartnerContacts(partner_pks);

            // Partner Fiscal Sponsor
            const partner_fiscal_sponsors: any = await this.applicationService.getPartnerFiscalSponsor(partner_pks);

            // Partner Non-profit Equivalency Determination
            const partner_nonprofit_equivalency_determinations: any =
                await this.applicationService.getPartnerNonprofitEquivalencyDetermination(partner_pks);

            // Reviews
            const applicationReviews: any = await this.applicationService.getReviews(pks);

            applications.data.forEach((application) => {
                if (!application.hasOwnProperty('partner')) {
                    application['partner'] = {};
                }
                const partner = partners.filter((partner) => partner.pk == application.partner_pk);
                application['partner'] = partner[0];

                if (!application['partner'].hasOwnProperty('organization')) {
                    application['partner']['organization'] = {};
                }
                const partner_organization = partner_organizations.filter(
                    (organization) => organization.partner_pk == application.partner_pk,
                );
                application['partner']['organization'] = partner_organization;

                if (!application['partner'].hasOwnProperty('contacts')) {
                    application['partner']['contacts'] = {};
                }
                const partner_contact = partner_contacts.filter(
                    (contact) => contact.partner_pk == application.partner_pk,
                );
                application['partner']['contacts'] = partner_contact;

                if (!application['partner'].hasOwnProperty('partner_fiscal_sponsor')) {
                    application['partner']['partner_fiscal_sponsor'] = {};
                }
                const partner_fiscal_sponsor = partner_fiscal_sponsors.filter(
                    (fiscal) => fiscal.partner_pk == application.partner_pk,
                );
                application['partner']['partner_fiscal_sponsor'] = partner_fiscal_sponsor[0];

                if (!application['partner'].hasOwnProperty('partner_nonprofit_equivalency_determination')) {
                    application['partner']['partner_nonprofit_equivalency_determination'] = {};
                }
                const partner_nonprofit_equivalency_determination = partner_nonprofit_equivalency_determinations.filter(
                    (nonprofit) => nonprofit.partner_pk == application.partner_pk,
                );
                application['partner']['partner_nonprofit_equivalency_determination'] =
                    partner_nonprofit_equivalency_determination[0];

                if (!application.hasOwnProperty('reviews')) {
                    application['reviews'] = [];
                }
                const applicationReview = applicationReviews.filter((review) => review.pk == application.pk);
                application['reviews'] = applicationReview[0]?.['reviews'] ?? [];
            });
        }

        return applications;
    }

    // @UseGuards(JwtAuthGuard)
    @Get(':pk')
    async fetchOne(@Param('pk') pk: string) {
        const application: any = await this.applicationService.find({ pk });
        const partnerPks = [application?.data?.partner_pk as number];
        // partner
        const partner = await this.applicationQueryHelpersService.getPartner(partnerPks);
        application.data['partner'] = partner[0];

        // partner organization
        const partnerOrganization = await this.applicationQueryHelpersService.getPartnerOrganization(partnerPks);
        application.data['partner']['organization'] = partnerOrganization[0];

        // partner contacts
        const partnerContacts = await this.applicationQueryHelpersService.getPartnerContacts(partnerPks);
        application.data['partner']['contacts'] = partnerContacts;

        // partner fiscal sponsor
        const partnerFiscalSponsor = await this.applicationQueryHelpersService.getPartnerFiscalSponsor(partnerPks);
        application.data['partner']['partner_fiscal_sponsor'] = partnerFiscalSponsor[0];

        // partner non-profit equivalency determination
        const partnerNonprofitEquivalencyDetermination =
            await this.applicationQueryHelpersService.getPartnerNonProfitEquivalencyDetermination(partnerPks);
        application.data['partner']['partner_nonprofit_equivalency_determination'] =
            partnerNonprofitEquivalencyDetermination[0];

        return application;
    }

    @Get(':uuid/generated')
    async generated(@Param('uuid') uuid: string) {
        const application: any = await this.applicationService.find({ uuid });
        const partnerPks = [application?.data?.partner_pk as number];
        // partner
        const partner = await this.applicationQueryHelpersService.getPartner(partnerPks);
        application.data['partner'] = partner[0];

        // partner organization
        const partnerOrganization = await this.applicationQueryHelpersService.getPartnerOrganization(partnerPks);
        application.data['partner']['organization'] = partnerOrganization[0];

        // partner contacts
        const partnerContacts = await this.applicationQueryHelpersService.getPartnerContacts(partnerPks);
        application.data['partner']['contacts'] = partnerContacts;

        // partner fiscal sponsor
        const partnerFiscalSponsor = await this.applicationQueryHelpersService.getPartnerFiscalSponsor(partnerPks);
        application.data['partner']['partner_fiscal_sponsor'] = partnerFiscalSponsor[0];

        // partner non-profit equivalency determination
        const partnerNonprofitEquivalencyDetermination =
            await this.applicationQueryHelpersService.getPartnerNonProfitEquivalencyDetermination(partnerPks);
        application.data['partner']['partner_nonprofit_equivalency_determination'] =
            partnerNonprofitEquivalencyDetermination[0];

        // Reviews
        const applicationReviews: any = await this.applicationService.getReviews([application?.data?.pk]);
        application.data['reviews'] = applicationReviews[0]?.['reviews'] ?? [];

        const projectReviews: any = await this.projectService.getReviews([application?.data?.project?.pk]);
        application.data.project['reviews'] = projectReviews[0]?.['reviews'] ?? [];

        return application;
    }

    @UseGuards(JwtAuthGuard)
    @Get(':number/review')
    async review(@Param('number') number: string, @Request() req: any) {
        const application: any = await this.applicationService.find({ number, reviews: req.query.reviews });
        // Partner
        const partner = await this.applicationService.getPartner([application.data.partner_pk]);
        if (!application.data.hasOwnProperty('partner')) {
            application.data['partner'] = {};
        }
        application.data['partner'] = partner[0];

        // Partner Organization
        const partner_organizations = await this.applicationService.getPartnerOrganization([
            application.data['partner'].pk,
        ]);
        if (!application.data['partner'].hasOwnProperty('organization')) {
            application.data['partner']['organization'] = {};
        }
        application.data['partner']['organization'] = partner_organizations[0];

        // Partner Contacts
        const partner_contacts = await this.applicationService.getPartnerContacts([application.data['partner'].pk]);
        if (!application.data['partner'].hasOwnProperty('contacts')) {
            application.data['partner']['contacts'] = {};
        }
        application.data['partner']['contacts'] = partner_contacts;

        // Partner Fiscal Sponsor
        const partner_fiscal_sponsor = await this.applicationService.getPartnerFiscalSponsor([
            application.data['partner'].pk,
        ]);
        if (!application.data['partner'].hasOwnProperty('partner_fiscal_sponsor')) {
            application.data['partner']['partner_fiscal_sponsor'] = {};
        }
        application.data['partner']['partner_fiscal_sponsor'] = partner_fiscal_sponsor[0];

        // Partner Non-profit Equivalency Determination
        const partner_nonprofit_equivalency_determination =
            await this.applicationService.getPartnerNonprofitEquivalencyDetermination([application.data['partner'].pk]);
        if (!application.data['partner'].hasOwnProperty('partner_nonprofit_equivalency_determination')) {
            application.data['partner']['partner_nonprofit_equivalency_determination'] = {};
        }
        application.data['partner']['partner_nonprofit_equivalency_determination'] =
            partner_nonprofit_equivalency_determination[0];

        // Reviews
        const applicationReviews = await this.applicationService.getReviews([application.data.pk]);
        if (!application.data.hasOwnProperty('reviews')) {
            application.data['reviews'] = [];
        }
        application.data['reviews'] = applicationReviews[0]?.['reviews'] ?? [];

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
