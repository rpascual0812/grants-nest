import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
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

    @UseGuards(JwtAuthGuard)
    @Get()
    fetch() {
        return this.applicationService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':pk')
    fetchOne(@Param('pk') pk: string) {
        return this.applicationService.find({ pk });
    }

    @UseGuards(JwtAuthGuard)
    @Get(':number/review')
    review(@Param('number') number: string) {
        return this.applicationService.find({ number });
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':pk')
    remove(@Param('pk') pk: string, @Request() req: any) {
        console.log('deleting', pk);
        return this.applicationService.remove(+pk, req.user);
    }
}
