import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import dataSource from 'db/data-source';
import { Document } from './entities/document.entity';

@Injectable()
export class DocumentService {
    constructor(
        @InjectRepository(Document)
        private documentRepository: Repository<Document>,
    ) { }

    create(file: any) {
        const obj = {
            original_name: file.originalname,
            filename: file.filename,
            path: file.path,
            mime_type: file.mimetype,
            size: file.size,
        }
        console.log(3, obj);
        const newDocument = this.documentRepository.create(obj);
        return this.documentRepository.save(newDocument);
    }

    async findAll(pagination: any) {
        return await dataSource
            .manager
            .getRepository(Document)
            .createQueryBuilder()
            .orderBy('pk', 'DESC')
            .skip(pagination.skip)
            .take(pagination.take)
            .getMany()
            ;
    }
}
