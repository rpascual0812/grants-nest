import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UseInterceptors, UploadedFile, Response, HttpStatus, UnauthorizedException, InternalServerErrorException, Put } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    async fetch(@Request() req: any) {
        let projects: any = await this.projectsService.findAll(req.query);
        if (projects.data.length > 0) {
            const pks = projects.data.map((application) => application.pk);
            const partner_pks = projects.data.map((application) => application.partner_pk);

            // Partner
            const partners: any = await this.projectsService.getPartner(partner_pks);

            // Partner Organization
            const partner_organizations: any = await this.projectsService.getPartnerOrganization(partner_pks);

            // Partner Contacts
            const partner_contacts: any = await this.projectsService.getPartnerContacts(partner_pks);

            // Partner Fiscal Sponsor
            const partner_fiscal_sponsors: any = await this.projectsService.getPartnerFiscalSponsor(partner_pks);

            // Partner Non-profit Equivalency Determination
            const partner_nonprofit_equivalency_determinations: any = await this.projectsService.getPartnerNonprofitEquivalencyDetermination(partner_pks);

            // Reviews
            const projectReviews: any = await this.projectsService.getReviews(pks);

            projects.data.forEach(project => {
                if (!project.hasOwnProperty('partner')) {
                    project['partner'] = {};
                }
                const partner = partners.filter(partner => partner.pk == project.partner_pk);
                project['partner'] = partner[0];

                if (!project['partner'].hasOwnProperty('organization')) {
                    project['partner']['organization'] = {};
                }
                const partner_organization = partner_organizations.filter(organization => organization.partner_pk == project.partner_pk);
                project['partner']['organization'] = partner_organization;

                if (!project['partner'].hasOwnProperty('contacts')) {
                    project['partner']['contacts'] = {};
                }
                const partner_contact = partner_contacts.filter(contact => contact.partner_pk == project.partner_pk);
                project['partner']['contacts'] = partner_contact;

                if (!project['partner'].hasOwnProperty('partner_fiscal_sponsor')) {
                    project['partner']['partner_fiscal_sponsor'] = {};
                }
                const partner_fiscal_sponsor = partner_fiscal_sponsors.filter(fiscal => fiscal.partner_pk == project.partner_pk);
                project['partner']['partner_fiscal_sponsor'] = partner_fiscal_sponsor[0];

                if (!project['partner'].hasOwnProperty('partner_nonprofit_equivalency_determination')) {
                    project['partner']['partner_nonprofit_equivalency_determination'] = {};
                }
                const partner_nonprofit_equivalency_determination = partner_nonprofit_equivalency_determinations.filter(nonprofit => nonprofit.partner_pk == project.partner_pk);
                project['partner']['partner_nonprofit_equivalency_determination'] = partner_nonprofit_equivalency_determination[0];

                if (!project.hasOwnProperty('reviews')) {
                    project['reviews'] = [];
                }
                const projectReview = projectReviews.filter(review => review.pk == project.pk);
                project['reviews'] = projectReview[0]?.['reviews'] ?? [];
            });
        }

        return projects;
    }

    @UseGuards(JwtAuthGuard)
    @Get(':pk/review')
    async fetchReview(@Param('pk') pk: number, @Request() req: any) {
        const project: any = await this.projectsService.find({ pk });

        // Application
        const application = await this.projectsService.getApplication([project.data.pk]);
        if (!project.data.hasOwnProperty('partner')) {
            project.data['application'] = {};
        }
        project.data['application'] = application[0];

        // Partner
        const partner = await this.projectsService.getPartner([project.data.partner_pk]);
        if (!project.data.hasOwnProperty('partner')) {
            project.data['partner'] = {};
        }
        project.data['partner'] = partner[0];

        // Partner Organization
        const partner_organizations = await this.projectsService.getPartnerOrganization([project.data['partner'].pk]);
        if (!project.data['partner'].hasOwnProperty('organization')) {
            project.data['partner']['organization'] = {};
        }
        project.data['partner']['organization'] = partner_organizations[0];

        // Partner Contacts
        const partner_contacts = await this.projectsService.getPartnerContacts([project.data['partner'].pk]);
        if (!project.data['partner'].hasOwnProperty('contacts')) {
            project.data['partner']['contacts'] = [];
        }
        project.data['partner']['contacts'] = partner_contacts;

        // Partner Fiscal Sponsor
        const partner_fiscal_sponsor = await this.projectsService.getPartnerFiscalSponsor([project.data['partner'].pk]);
        if (!project.data['partner'].hasOwnProperty('partner_fiscal_sponsor')) {
            project.data['partner']['partner_fiscal_sponsor'] = {};
        }
        project.data['partner']['partner_fiscal_sponsor'] = partner_fiscal_sponsor[0];

        // Partner Non-profit Equivalency Determination
        const partner_nonprofit_equivalency_determination = await this.projectsService.getPartnerNonprofitEquivalencyDetermination([project.data['partner'].pk]);
        if (!project.data['partner'].hasOwnProperty('partner_nonprofit_equivalency_determination')) {
            project.data['partner']['partner_nonprofit_equivalency_determination'] = {};
        }
        project.data['partner']['partner_nonprofit_equivalency_determination'] =
            partner_nonprofit_equivalency_determination[0];

        // Reviews
        const projectReviews = await this.projectsService.getReviews([project.data.pk]);
        if (!project.data.hasOwnProperty('reviews')) {
            project.data['reviews'] = [];
        }
        project.data['reviews'] = projectReviews[0]?.['reviews'] ?? [];

        return project;
    }

}
