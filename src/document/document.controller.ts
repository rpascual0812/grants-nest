import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Response, UploadedFile, HttpStatus, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { editFileName, imageFileFilter } from '../utilities/upload.utils';
import { DocumentService } from './document.service';

@Controller('documents')
export class DocumentController {
    constructor(private readonly documentService: DocumentService) { }

    @Post('upload')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: (req, file, callback) => {
                    callback(null, process.env.UPLOAD_DIR + '/documents');
                },
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
        }),
    )
    async uploadedFile(@UploadedFile() file: Express.Multer.File, @Request() req) {
        console.log(33, file);
        return await this.documentService.create(file);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(@Request() req: any) {
        return this.documentService.findAll(req.query);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async save(@Body() body: any, @Request() req: any) {
        return this.documentService.save(body, req.user);
    }
}
