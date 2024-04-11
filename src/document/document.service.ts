import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import dataSource from 'db/data-source';
import { Document } from './entities/document.entity';
import { GlobalService } from 'src/utilities/global.service';

@Injectable()
export class DocumentService extends GlobalService {

    constructor(
        @InjectRepository(Document)
        private documentRepository: Repository<Document>,
    ) {
        super();
    }

    create(file: any) {
        const obj = {
            original_name: file.originalname,
            filename: file.filename,
            path: file.path,
            mime_type: file.mimetype,
            size: file.size,
        }

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

    async save(data: any, user: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(
                async (EntityManager) => {
                    let output = null;
                    if (data.table_name == 'applications') {
                        await EntityManager.query(
                            'insert into document_application_relation (document_pk, application_pk) values ($1 ,$2);',
                            [data.document_pk, data.table_pk],
                        );

                        output = await EntityManager.update(Document, { pk: data.document_pk }, { type: data.type });
                    }

                    if (data.table_name == 'partners') {
                        await EntityManager.query(
                            'insert into document_partner_relation (document_pk, partner_pk) values ($1 ,$2);',
                            [data.document_pk, data.table_pk],
                        );

                        output = await EntityManager.update(Document, { pk: data.document_pk }, { type: data.type });
                    }

                    return { status: output ? true : false, data: output };
                }
            );
        } catch (err) {
            console.log(err);
            return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }
    }

    async destroy(pk: number, user: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(
                async (EntityManager) => {

                    // delete file from all relations
                    await EntityManager.query(
                        'delete from document_application_relation where document_pk = $1;',
                        [pk],
                    );
                    await EntityManager.query(
                        'delete from document_review_relation where document_pk = $1;',
                        [pk],
                    );
                    await EntityManager.query(
                        'delete from document_partner_relation where document_pk = $1;',
                        [pk],
                    );
                    await EntityManager.query(
                        'delete from document_partner_fiscal_sponsor_relation where document_pk = $1;',
                        [pk],
                    );
                    await EntityManager.query(
                        'delete from document_partner_organization_other_info_relation where document_pk = $1;',
                        [pk],
                    );

                    const doc = await EntityManager.update(Document, { pk }, { archived: true });

                    // save logs
                    const model = {
                        pk: pk,
                        document_pk: pk,
                        name: 'documents',
                        status: 'deleted',
                    };
                    await this.saveLog({ model, user });

                    return {
                        status: doc ? true : false,
                    };
                }
            );
        } catch (err) {
            console.log(err);
            return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }
    }
}
