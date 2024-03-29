import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, Req } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('application')
export class ApplicationController {
    constructor(private readonly applicationService: ApplicationService) { }

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

    @Post('partner')
    savePartner(@Body() body: any, @Request() req: any) {
        return this.applicationService.savePartner(body);
    }

    @Post('partner_organization')
    savePartnerOrg(@Body() body: any, @Request() req: any) {
        return this.applicationService.savePartnerOrg(body);
    }

    @Post('fiscal_sponsor')
    saveFiscalSponsor(@Body() body: any, @Request() req: any) {
        return this.applicationService.saveFiscalSponsor(body);
    }

    @Post('nonprofit_equivalency_determination')
    saveNonProfitEquivalencyDetermination(@Body() body: any, @Request() req: any) {
        return this.applicationService.saveNonProfitEquivalencyDetermination(body);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    fetch(@Request() req: any) {
        return this.applicationService.findAll(req.query);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':pk')
    fetchOne(@Param('pk') pk: string) {
        return this.applicationService.find({ pk });
    }

    @Get(':uuid/generated')
    generated(@Param('uuid') uuid: string) {
        return this.applicationService.find({ uuid });
    }

    @UseGuards(JwtAuthGuard)
    @Get(':number/review')
    review(@Param('number') number: string) {
        return this.applicationService.find({ number });
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':pk')
    remove(@Param('pk') pk: number, @Request() req: any) {
        console.log('deleting', pk);
        return this.applicationService.remove(+pk, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':pk/project/:project_pk/location/:location_pk')
    removeProjectLocation(
        @Param('pk') pk: number,
        @Param('project_pk') project_pk: number,
        @Param('location_pk') location_pk: number,
        @Request() req: any,
    ) {
        console.log('deleting', pk, project_pk, location_pk);
        return this.applicationService.removeProjectLocation(+pk, +project_pk, +location_pk, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':pk/proposal/:proposal_pk/activity/:activity_pk')
    removeProposalActivity(
        @Param('pk') pk: number,
        @Param('proposal_pk') proposal_pk: number,
        @Param('activity_pk') activity_pk: number,
        @Request() req: any,
    ) {
        console.log('deleting', pk, proposal_pk, activity_pk);
        return this.applicationService.removeProposalActivity(+pk, +proposal_pk, +activity_pk, req.user);
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
}
