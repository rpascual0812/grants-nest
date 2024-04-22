import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('roles')
export class RoleController {
    constructor(private readonly roleService: RoleService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(@Request() req: any) {
        return this.roleService.findAll(req.query);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    save(@Request() req: any) {
        return this.roleService.save(req.body, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('restrictions')
    saveRestriction(@Body() body, @Request() req: any) {
        return this.roleService.saveRestriction(body, req.user);
    }
}
