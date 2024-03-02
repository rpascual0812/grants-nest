import { Injectable } from '@nestjs/common';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import dataSource from 'db/data-source';
import { Partner } from './entities/partner.entity';

@Injectable()
export class PartnerService {
    create(createPartnerDto: CreatePartnerDto) {
        return 'This action adds a new partner';
    }

    async findAll() {
        try {
            const partners = await dataSource.manager
                .getRepository(Partner)
                .createQueryBuilder('partners')
                .select('partners')
                .where('partners.archived=false')
                .orderBy('partners.name')
                .getManyAndCount();

            return {
                status: true,
                data: partners[0],
                total: partners[1],
            };
        } catch (error) {
            return {
                status: false,
                code: 500,
            };
        }
    }

    findOne(id: number) {
        return `This action returns a #${id} partner`;
    }

    update(id: number, updatePartnerDto: UpdatePartnerDto) {
        return `This action updates a #${id} partner`;
    }

    remove(id: number) {
        return `This action removes a #${id} partner`;
    }
}
