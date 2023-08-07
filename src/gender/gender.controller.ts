import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { GenderService } from './gender.service';

@Controller('genders')
export class GenderController {
    constructor(private readonly genderService: GenderService) { }

    @Get()
    findAll(@Request() req: any) {
        return this.genderService.findAll(req.query);
    }
}
