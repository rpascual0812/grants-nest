import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TypeService } from './type.service';

@Controller('types')
export class TypeController {
    constructor(private readonly typeService: TypeService) { }

    @Get()
    async findAll() {
        console.log('type');
        return this.typeService.findAll();
    }
}
