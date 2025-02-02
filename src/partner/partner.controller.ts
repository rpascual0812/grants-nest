import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { PartnerService } from './partner.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('partner')
export class PartnerController {
    constructor(private readonly partnerService: PartnerService) { }

    @Get()
    async fetch(
        @Query()
        query: {
            organization_pk?: number;
            type_pk?: number;
            keyword?: string;
            partner_name_sort?: 'ASC' | 'DESC';
            partner_date_created_year?: string;
        },
    ) {
        const { organization_pk, type_pk, keyword, partner_name_sort, partner_date_created_year } = query;
        const partners = await this.partnerService.findAll({
            organization_pk: organization_pk ? +organization_pk : null,
            type_pk: type_pk ? +type_pk : null,
            partner_date_created_year,
            partner_name_sort,
            keyword,
        });
        // ugly hack to get the last status and count grand total
        if (partners && partners.data) {
            partners.data.forEach((partner) => {
                partner['grand_total_amount'] = 0;
                if (partner.applications) {
                    partner.applications.forEach((application) => {
                        // application['application_status'] = null;
                        // if (application.statuses.length > 0) {
                        //     const count = application.statuses.length;
                        //     application['application_status'] = application.statuses[count - 1];
                        // }
                        if (application.project && application.project.project_proposal) {
                            partner['grand_total_amount'] += parseInt(
                                application.project.project_proposal.budget_request_usd.toString(),
                            );
                        }
                        // delete application.statuses;
                    });
                }
            });
        }

        return partners;
    }

    @Get(':pk')
    fetchOne(@Param('pk') pk: string) {
        return this.partnerService.find({ pk: +pk });
    }

    @Post()
    async save(@Request() req: any, @Body() body: any) {
        return await this.partnerService.save(body);
    }

    @UseGuards(JwtAuthGuard)
    @Post('assessment')
    saveAssessment(@Body() body: any, @Request() req: any) {
        return this.partnerService.saveAssessment(body, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':pk/assessment/:assessment_pk')
    deleteAssessment(@Param('assessment_pk') assessment_pk, @Request() req: any) {
        return this.partnerService.deleteAssessment(assessment_pk, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':pk/assessment')
    assessments(@Param('pk') pk: number, @Request() req: any) {
        return this.partnerService.findAssessments(+pk, req.query, req.user);
    }

    @Post('partner_id/generate')
    async generatePartnerId(@Body() body: any, @Request() req: any) {
        return await this.partnerService.generatePartnerId(body);
    }
}
