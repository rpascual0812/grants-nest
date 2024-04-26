import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
    UseInterceptors,
    UploadedFile,
    Response,
    HttpStatus,
    UnauthorizedException,
    InternalServerErrorException,
    Put,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectService: ProjectsService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    async fetch(@Request() req: any) {
        let projects: any = await this.projectService.findAll(req.query);
        if (projects.data.length > 0) {
            const pks = projects.data.map((application) => application.pk);
            const partner_pks = projects.data.map((application) => application.partner_pk);

            // Partner
            const partners: any = await this.projectService.getPartner(partner_pks);

            // Partner Organization
            const partner_organizations: any = await this.projectService.getPartnerOrganization(partner_pks);

            // Partner Contacts
            const partner_contacts: any = await this.projectService.getPartnerContacts(partner_pks);

            // Partner Fiscal Sponsor
            const partner_fiscal_sponsors: any = await this.projectService.getPartnerFiscalSponsor(partner_pks);

            // Partner Non-profit Equivalency Determination
            const partner_nonprofit_equivalency_determinations: any =
                await this.projectService.getPartnerNonprofitEquivalencyDetermination(partner_pks);

            // Reviews
            const projectReviews: any = await this.projectService.getReviews(pks);

            projects.data.forEach((project) => {
                if (!project.hasOwnProperty('partner')) {
                    project['partner'] = {};
                }

                const partner = partners.filter((partner) => partner.pk == project.partner_pk);
                project['partner'] = partner[0] ?? {};
                if (!project.partner.hasOwnProperty('organization')) {
                    project['partner']['organization'] = {};
                }
                const partner_organization = partner_organizations.filter(
                    (organization) => organization.partner_pk == project.partner_pk,
                );
                project['partner']['organization'] = partner_organization;

                if (!project['partner'].hasOwnProperty('contacts')) {
                    project['partner']['contacts'] = {};
                }
                const partner_contact = partner_contacts.filter((contact) => contact.partner_pk == project.partner_pk);
                project['partner']['contacts'] = partner_contact;

                if (!project['partner'].hasOwnProperty('partner_fiscal_sponsor')) {
                    project['partner']['partner_fiscal_sponsor'] = {};
                }
                const partner_fiscal_sponsor = partner_fiscal_sponsors.filter(
                    (fiscal) => fiscal.partner_pk == project.partner_pk,
                );
                project['partner']['partner_fiscal_sponsor'] = partner_fiscal_sponsor[0];

                if (!project['partner'].hasOwnProperty('partner_nonprofit_equivalency_determination')) {
                    project['partner']['partner_nonprofit_equivalency_determination'] = {};
                }
                const partner_nonprofit_equivalency_determination = partner_nonprofit_equivalency_determinations.filter(
                    (nonprofit) => nonprofit.partner_pk == project.partner_pk,
                );
                project['partner']['partner_nonprofit_equivalency_determination'] =
                    partner_nonprofit_equivalency_determination[0];

                if (!project.hasOwnProperty('reviews')) {
                    project['reviews'] = [];
                }
                const projectReview = projectReviews.filter((review) => review.pk == project.pk);
                project['reviews'] = projectReview[0]?.['reviews'] ?? [];
            });
        }

        return projects;
    }

    @UseGuards(JwtAuthGuard)
    @Get(':pk/review')
    async fetchReview(@Param('pk') pk: number, @Request() req: any) {
        const project: any = await this.projectService.find({ pk });

        // Application
        const application = await this.projectService.getApplication([project.data.application_pk]);
        if (!project.data.hasOwnProperty('partner')) {
            project.data['application'] = {};
        }
        project.data['application'] = application[0];

        // Partner
        const partner = await this.projectService.getPartner([project.data.partner_pk]);
        if (!project.data.hasOwnProperty('partner')) {
            project.data['partner'] = {};
        }
        project.data['partner'] = partner[0];

        // Partner Organization
        const partner_organizations = await this.projectService.getPartnerOrganization([
            project?.data?.['partner']?.pk,
        ]);

        if (!project.data['partner'].hasOwnProperty('organization')) {
            project.data['partner']['organization'] = {};
        }
        project.data['partner']['organization'] = partner_organizations[0];

        // Partner Contacts
        const partner_contacts = await this.projectService.getPartnerContacts([project.data['partner'].pk]);
        if (!project.data['partner'].hasOwnProperty('contacts')) {
            project.data['partner']['contacts'] = [];
        }
        project.data['partner']['contacts'] = partner_contacts;

        // Partner Fiscal Sponsor
        const partner_fiscal_sponsor = await this.projectService.getPartnerFiscalSponsor([project.data['partner'].pk]);
        if (!project.data['partner'].hasOwnProperty('partner_fiscal_sponsor')) {
            project.data['partner']['partner_fiscal_sponsor'] = {};
        }
        project.data['partner']['partner_fiscal_sponsor'] = partner_fiscal_sponsor[0];

        // Partner Non-profit Equivalency Determination
        const partner_nonprofit_equivalency_determination =
            await this.projectService.getPartnerNonprofitEquivalencyDetermination([project.data['partner'].pk]);
        if (!project.data['partner'].hasOwnProperty('partner_nonprofit_equivalency_determination')) {
            project.data['partner']['partner_nonprofit_equivalency_determination'] = {};
        }
        project.data['partner']['partner_nonprofit_equivalency_determination'] =
            partner_nonprofit_equivalency_determination[0];

        // Reviews
        const projectReviews = await this.projectService.getReviews([project.data.pk]);
        if (!project.data.hasOwnProperty('reviews')) {
            project.data['reviews'] = [];
        }
        project.data['reviews'] = projectReviews[0]?.['reviews'] ?? [];

        return project;
    }

    @UseGuards(JwtAuthGuard)
    @Post('attachment')
    saveAttachment(@Body() body: any, @Request() req: any) {
        return this.projectService.saveAttachment(body, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':pk/document/:document_pk')
    deleteApplicationAttachment(
        @Param('pk') project_pk: number,
        @Param('document_pk') document_pk: number,
        @Request() req: any,
    ) {
        return this.projectService.deleteAttachment(project_pk, document_pk, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('review')
    saveReview(@Body() body: any, @Request() req: any) {
        return this.projectService.saveReview(body, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('review/:pk')
    deleteReview(@Param('pk') pk: number, @Request() req: any) {
        return this.projectService.deleteReview(pk, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('recommendation')
    saveRecommendation(@Body() body: any, @Request() req: any) {
        return this.projectService.saveRecommendation(body, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('project_funding')
    saveProjectFunding(@Body() body: any, @Request() req: any) {
        return this.projectService.saveProjectFunding(body, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':pk/project_funding')
    fetchProjectFunding(@Param('pk') project_pk: number, @Request() req: any) {
        return this.projectService.getProjectFunding({ project_pk });
    }

    @UseGuards(JwtAuthGuard)
    @Post('project_funding_liquidation')
    saveProjectFundingLiquidation(@Body() body: any, @Request() req: any) {
        return this.projectService.saveProjectFundingLiquidation(body);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':pk/project_funding/:project_funding_pk/project_funding_report/:project_funding_report_pk')
    deleteFundingProjectReport(
        @Param('pk') project_pk: number,
        @Param('project_funding_pk') project_funding_pk: number,
        @Param('project_funding_report_pk') project_funding_report_pk: number,
        @Request() req: any,
    ) {
        return this.projectService.deleteProjectFundingReport(
            {
                project_pk,
                project_funding_pk,
                project_funding_report_pk,
            },
            req.user,
        );
    }

    @Post('liquidation/attachment')
    saveProjectFundingLiquidationAttachment(@Body() body: any, @Request() req: any) {
        return this.projectService.saveProjectFundingLiquidationAttachments(body, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':pk/project_site')
    fetchProjectSites(@Param('pk') project_pk: number, @Request() req: any) {
        return this.projectService.getProjectSite({ projectPks: [project_pk] });
    }

    @UseGuards(JwtAuthGuard)
    @Post('project_site')
    saveProjectSite(@Body() body: any, @Request() req: any) {
        return this.projectService.saveProjectSite(body, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':pk/project_site/:project_site_pk')
    deleteProjectSite(
        @Param('pk') project_pk: number,
        @Param('project_site_pk') project_site_pk: number,
        @Request() req: any,
    ) {
        return this.projectService.deleteProjectSite(
            {
                project_pk,
                project_site_pk,
            },
            req.user,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Post('update_financial_management_training')
    updateFinancialManagementTraining(@Body() body: any, @Request() req: any) {
        return this.projectService.updateFinancialManagementTraining(body, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':project_pk/events')
    getEvents(@Param('project_pk') project_pk: number, @Request() req: any) {
        return this.projectService.getEvents(project_pk, req.user);
    }
}
