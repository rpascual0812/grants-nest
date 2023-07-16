import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ValidationService } from './validation.service';
import { CreateValidationDto } from './dto/create-validation.dto';
import { UpdateValidationDto } from './dto/update-validation.dto';

@Controller('validation')
export class ValidationController {
    constructor(private readonly validationService: ValidationService) { }

    @Post()
    create(@Body() createValidationDto: CreateValidationDto) {
        return this.validationService.create(createValidationDto);
    }

    @Get()
    findAll() {
        return this.validationService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        // return this.validationService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateValidationDto: UpdateValidationDto) {
        return this.validationService.update(+id, updateValidationDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.validationService.remove(+id);
    }
}
