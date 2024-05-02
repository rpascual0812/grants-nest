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
    Query,
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
    async fetchReview(@Param('pk') pk: number) {
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
    async getEvents(@Param('project_pk') project_pk: number, @Request() req: any) {
        let events: any = await this.projectService.getEvents(project_pk, req.user);
        const pks = events.map((event) => event.pk);

        let attendees: any = await this.projectService.getAttendees(pks);
        events.forEach((event: any) => {
            if (!event.hasOwnProperty('attendees')) {
                event['attendees'] = [];
            }
            const attendee = attendees.filter((attendees) => attendees.project_event_pk == event.pk);
            event['attendees'] = attendee;
        });

        return events;
    }

    @UseGuards(JwtAuthGuard)
    @Post(':project_pk/events')
    saveEvent(@Param('project_pk') project_pk: number, @Body() body: any, @Request() req: any) {
        return this.projectService.saveEvent(project_pk, body, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':project_pk/events/:event_pk/attendee')
    saveAttendee(
        @Param('project_pk') project_pk: number,
        @Param('event_pk') event_pk: number,
        @Body() body: any,
        @Request() req: any,
    ) {
        return this.projectService.saveAttendee(project_pk, event_pk, body, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('attendee/:pk')
    destroyAttendee(@Param('pk') pk: number, @Request() req: any) {
        return this.projectService.destroyAttendee(pk, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':pk/objective-results')
    fetchProjectObjectiveResults(@Param('pk') project_pk: number, @Request() req: any) {
        return this.projectService.getProjectObjectiveResults(project_pk, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':pk/output')
    fetchProjectOutput(@Param('pk') project_pk: number, @Request() req: any) {
        return this.projectService.getProjectOutput(project_pk, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':pk/objective-results')
    saveProjectObjectiveResults(@Param('pk') project_pk: number, @Body() body: any, @Request() req: any) {
        return this.projectService.saveProjectObjectiveResult(project_pk, body, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':pk/output')
    saveProjectOutput(@Param('pk') project_pk: number, @Body() body: any, @Request() req: any) {
        return this.projectService.saveProjectOutput(project_pk, body, req.user);
    }

    @Get(':project_pk/project_beneficiary')
    async getProjectBeneficiaries(@Param('project_pk') project_pk: number, @Request() req: any) {
        return this.projectService.getProjectBeneficiaries({ project_pk });
    }

    @UseGuards(JwtAuthGuard)
    @Post('project_beneficiary')
    async saveProjectBeneficiary(@Body() body: any, @Request() req: any) {
        return this.projectService.saveProjectBeneficiary(body);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':pk/project_beneficiary/:project_beneficiary_pk')
    deleteProjectBeneficiary(
        @Param('pk') project_pk: number,
        @Param('project_beneficiary_pk') project_beneficiary_pk: number,
        @Request() req: any,
    ) {
        return this.projectService.deleteProjectBeneficiary(
            {
                pk: project_beneficiary_pk,
            },
            req.user,
        );
    }

    @Get(':project_pk/project_capdev_knowledge')
    async getProjectCapDevKnowledge(@Param('project_pk') project_pk: number, @Request() req: any) {
        return this.projectService.getProjectCapDevKnowledge({ project_pk });
    }

    @UseGuards(JwtAuthGuard)
    @Post('project_capdev_knowledge')
    async saveProjectCapDevKnowledge(@Body() body: any, @Request() req: any) {
        return this.projectService.saveProjectCapDevKnowledge(body, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':pk/project_capdev_knowledge/:project_capdev_knowledge_pk')
    async deleteProjectCapDevKnowledge(
        @Param('pk') project_pk: number,
        @Param('project_capdev_knowledge_pk') project_capdev_knowledge_pk: number,
        @Request() req: any,
    ) {
        return this.projectService.deleteProjectCapDevKnowledge(
            {
                project_pk: project_pk,
                pk: project_capdev_knowledge_pk,
            },
            req.user,
        );
    }

    @Get(':project_pk/project_capdev_skill')
    async getProjectCapDevSkill(@Param('project_pk') project_pk: number, @Request() req: any) {
        return this.projectService.getProjectCapDevSkill({ project_pk });
    }

    @UseGuards(JwtAuthGuard)
    @Post('project_capdev_skill')
    async saveProjectCapDevSkill(@Body() body: any, @Request() req: any) {
        return this.projectService.saveProjectCapDevSkill(body, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':pk/project_capdev_skill/:project_capdev_skill_pk')
    async deleteProjectCapDevSkill(
        @Param('pk') project_pk: number,
        @Param('project_capdev_skill_pk') project_capdev_skill_pk: number,
        @Request() req: any,
    ) {
        return this.projectService.deleteProjectCapDevSkill(
            {
                project_pk: project_pk,
                pk: project_capdev_skill_pk,
            },
            req.user,
        );
    }

    @Get(':project_pk/project_capdev_observe')
    async getProjectCapDevObserve(@Param('project_pk') project_pk: number, @Request() req: any) {
        return this.projectService.getProjectCapDevObserve({ project_pk });
    }

    @UseGuards(JwtAuthGuard)
    @Post('project_capdev_observe')
    async saveProjectCapDevObserve(@Body() body: any, @Request() req: any) {
        return this.projectService.saveProjectCapDevObserve(body, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':pk/project_capdev_observe/:project_capdev_observe_pk')
    async deleteProjectCapDevObserve(
        @Param('pk') project_pk: number,
        @Param('project_capdev_observe_pk') project_capdev_observe_pk: number,
        @Request() req: any,
    ) {
        return this.projectService.deleteProjectCapDevObserve(
            {
                project_pk: project_pk,
                pk: project_capdev_observe_pk,
            },
            req.user,
        );
    }

    @Get(':project_pk/project_lesson')
    async getProjectLesson(
        @Param('project_pk') project_pk: number,
        @Query() query: { type?: string },
        @Request() req: any,
    ) {
        return this.projectService.getProjectLesson({
            project_pk,
            type: query?.type,
        });
    }

    @UseGuards(JwtAuthGuard)
    @Post('project_lesson')
    async saveProjectLesson(@Body() body: any, @Request() req: any) {
        return this.projectService.saveProjectLesson(body, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':pk/project_lesson/:project_lesson_pk')
    async deleteProjectLesson(
        @Param('pk') project_pk: number,
        @Param('project_lesson_pk') project_lesson_pk: number,
        @Request() req: any,
    ) {
        return this.projectService.deleteProjectLesson(
            {
                project_pk: project_pk,
                pk: project_lesson_pk,
            },
            req.user,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Get(':pk/documents')
    async fetchDocuments(@Param('pk') pk: number, @Request() req: any) {
        const project: any = await this.projectService.findDocuments(req.query);

        return project;
    }

    @UseGuards(JwtAuthGuard)
    @Get(':pk/links')
    async fetchLinks(@Param('pk') pk: number, @Request() req: any) {
        return await this.projectService.findLinks(req.query);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':pk/links')
    async saveLink(@Param('pk') pk: number, @Body() body: any, @Request() req: any) {
        return await this.projectService.saveLink(pk, body, req.user);
    }
}
