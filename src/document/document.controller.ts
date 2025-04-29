import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Response, UploadedFile, HttpStatus, UseGuards, UseInterceptors, ParseFilePipeBuilder, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { editFileName } from '../utilities/upload.utils';
import { DocumentService } from './document.service';
import { Throttle } from '@nestjs/throttler';

@Controller('documents')
export class DocumentController {
    constructor(private readonly documentService: DocumentService) { }

    @Throttle({ default: { limit: 3, ttl: 60000 } })
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadedFile(@UploadedFile() file: Express.Multer.File) {
        const uploaded = this.documentService.handleFileUpload(file);
        return await this.documentService.uploadFile(uploaded.fileName, file);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(@Request() req: any) {
        let documents = this.documentService.findAll(req.query);
        return documents;
    }

    // @UseGuards(JwtAuthGuard)
    @Post()
    async save(@Body() body: any, @Request() req: any) {
        return this.documentService.save(body, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':pk')
    async destroy(@Param('pk') pk: number, @Request() req: any) {
        return this.documentService.destroy(pk, req.user);
    }
}
