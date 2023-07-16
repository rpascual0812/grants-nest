import { Injectable, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseEntity, getRepository, Repository } from 'typeorm';
import { Email } from './entities/email.entity';
import dataSource from 'db/data-source';

@Injectable()
export class EmailService extends BaseEntity {
    uuid: string;
    from: string;
    from_name: string;
    to: string;
    to_name: string;
    cc: string;
    bcc: string;
    subject: string;
    body: string;
    account_pk: number;
    user_pk: number;

    constructor(
        @InjectRepository(Email)
        private emailRepository: Repository<Email>,
    ) {
        super();
    }

    @UsePipes(ValidationPipe)
    async create() {
        this.uuid = uuidv4();

        const obj: any = {
            account: this.account_pk,
            user_pk: this.user_pk,
            uuid: this.uuid,
            from: this.from,
            from_name: this.from_name,
            to: this.to,
            to_name: this.to_name,
            cc: this.cc,
            bcc: this.bcc,
            subject: this.subject,
            body: this.body
        }

        const newEmail = this.emailRepository.create(obj);
        return await this.emailRepository.save(newEmail);
    }

    async findAll(pagination) {
        return await dataSource.getRepository(Email)
            .createQueryBuilder()
            .where("sent = :sent", { sent: false })
            .orderBy('pk', 'DESC')
            .skip(pagination.skip)
            .take(pagination.take)
            .getMany()
            ;
    }

    async update(pk: number, data: any) {
        return await dataSource.getRepository(Email)
            .createQueryBuilder()
            .update(Email)
            .set(data)
            .where("pk = :pk", { pk: pk })
            .execute();
    }
}
