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
import { PartnerService } from './partner.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('partner')
export class PartnerController {
    constructor(private readonly partnerService: PartnerService) {}

    @Get()
    async fetch(@Query() query: { organization_pk?: number; type_pk?: number; keyword?: string }) {
        const { organization_pk, type_pk, keyword } = query;
        const partners = await this.partnerService.findAll({
            organization_pk: organization_pk ? +organization_pk : null,
            type_pk: type_pk ? +type_pk : null,
            keyword,
        });
        // ugly hack to get the last status and count grand total
        if (partners && partners.data) {
            partners.data.forEach((partner) => {
                partner['grand_total_amount'] = 0;
                if (partner.applications) {
                    partner.applications.forEach((application) => {
                        application['application_status'] = null;
                        if (application.application_statuses.length > 0) {
                            const count = application.application_statuses.length;
                            application['application_status'] = application.application_statuses[count - 1];
                        }
                        if (application.project && application.project.project_proposal) {
                            partner['grand_total_amount'] += parseInt(
                                application.project.project_proposal.budget_request_usd.toString(),
                            );
                        }
                        delete application.application_statuses;
                    });
                }
            });
        }

        return partners;
    }

    @Get(':partner_id')
    fetchOne(@Param('partner_id') partner_id: string) {
        return this.partnerService.find({ partner_id: +partner_id });
    }

    @Post()
    async save(@Request() req: any, @Body() body: any) {
        return await this.partnerService.save(body);
    }

    @UseGuards(JwtAuthGuard)
    @Post('assessment')
    savePartner(@Body() body: any, @Request() req: any) {
        return this.partnerService.saveAssessment(body, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':pk/assessment')
    assessments(@Param('pk') pk: number, @Request() req: any) {
        return this.partnerService.findAssessments(+pk, req.query, req.user);
    }
}
