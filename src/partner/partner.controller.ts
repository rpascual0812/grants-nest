import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PartnerService } from './partner.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';

@Controller('partner')
export class PartnerController {
    constructor(private readonly partnerService: PartnerService) { }

    @Get()
    fetch() {
        return this.partnerService.fetch();
    }

    @Get(':pk')
    fetchOne(@Param('pk') pk: string) {
        return this.partnerService.fetchOne(+pk);
    }
}
