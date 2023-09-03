import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { LogService } from './log.service';
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';

@Controller('logs')
export class LogController {
    constructor(private readonly logService: LogService) { }

    @Get()
    findAll(@Request() req: any) {
        return this.logService.findAll(req.query);
    }
}
