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

    // @UseGuards(JwtAuthGuard)
    @Post('partner')
    savePartner(@Body() body: any) {
        return this.applicationService.savePartner(body);
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
    generated(@Param('uuid') uuid: string) {
        return this.applicationService.find({ uuid });
    }

    @UseGuards(JwtAuthGuard)
    @Get(':number/review')
    review(@Param('number') number: string, @Request() req: any) {
        return this.applicationService.find({ number, reviews: req.query.reviews });
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
    deleteApplicationAttachment(@Param('pk') application_pk: number, @Param('document_pk') document_pk: number, @Request() req: any) {
        return this.applicationService.deleteApplicationAttachment(application_pk, document_pk, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':pk/review/:review_pk/document/:document_pk')
    deleteReviewAttachment(@Param('pk') application_pk: number, @Param('review_pk') review_pk: number, @Param('document_pk') document_pk: number, @Request() req: any) {
        return this.applicationService.deleteReviewAttachment(application_pk, review_pk, document_pk, req.user);
    }
}
