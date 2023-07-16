import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { CreateValidationDto } from './dto/create-validation.dto';
import { UpdateValidationDto } from './dto/update-validation.dto';
import { Validation } from './entities/validation.entity';
import dataSource from 'db/data-source';

@Injectable()
export class ValidationService {
    constructor(
        @InjectRepository(Validation)
        private validationRepository: Repository<Validation>,
    ) { }

    create(data: any) {
        const obj: any = {
            type: data.type,
            value: data.value,
            status: data.status
        }

        const newEmail = this.validationRepository.create(obj);
        return this.validationRepository.save(newEmail);
    }

    findAll() {
        return `This action returns all validation`;
    }

    async findOne(value: string): Promise<any> {
        return await dataSource.getRepository(Validation)
            .createQueryBuilder('validations')
            .where("value = :value", { value: value })
            .andWhere("archived = false")
            .orderBy('pk', 'DESC')
            .getOne()
            ;
    }

    update(id: number, updateValidationDto: UpdateValidationDto) {
        return `This action updates a #${id} validation`;
    }

    remove(id: number) {
        return `This action removes a #${id} validation`;
    }
}
