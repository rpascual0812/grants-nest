import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('application')
export class ApplicationController {
    constructor(private readonly applicationService: ApplicationService) {}

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
    @Get(':uuid')
    fetchOne(@Param('uuid') uuid: string) {
        return this.applicationService.find(uuid);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':pk')
    remove(@Param('pk') pk: string, @Request() req: any) {
        console.log('deleting', pk);
        return this.applicationService.remove(+pk, req.user);
    }
}
