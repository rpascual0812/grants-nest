import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { DonorService } from './donor.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('donors')
export class DonorController {
    constructor(private readonly donorService: DonorService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(@Request() req: any) {
        return this.donorService.findAll(req.query);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    save(@Request() req: any) {
        return this.donorService.save(req.body, req.user);
    }
}
