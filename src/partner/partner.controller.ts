import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UseInterceptors, UploadedFile, Response, HttpStatus, UnauthorizedException, InternalServerErrorException, Put } from '@nestjs/common';
import { PartnerService } from './partner.service';

@Controller('partner')
export class PartnerController {
    constructor(private readonly partnerService: PartnerService) { }

    @Get()
    fetch() {
        return this.partnerService.findAll();
    }

    @Get(':pk')
    fetchOne(@Param('pk') pk: string) {
        return this.partnerService.find(+pk);
    }

    @Post()
    async save(@Request() req: any, @Body() body: any) {
        return await this.partnerService.save(body);
    }
}
