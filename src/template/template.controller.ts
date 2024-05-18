import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { TemplateService } from './template.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@Controller('templates')
export class TemplateController {
    constructor(private readonly templateService: TemplateService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(@Request() req: any) {
        return this.templateService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    save(@Request() req: any) {
        return this.templateService.save(req.body, req.user);
    }
}
