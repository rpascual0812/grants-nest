import { Injectable } from '@nestjs/common';
import { CreateProvinceDto } from './dto/create-province.dto';
import { UpdateProvinceDto } from './dto/update-province.dto';
import { Province } from './entities/province.entity';
import dataSource from 'db/data-source';

@Injectable()
export class ProvinceService {
    create(createProvinceDto: CreateProvinceDto) {
        return 'This action adds a new province';
    }

    async findAll(countryPk?: number) {
        try {
            const provinces = await dataSource.manager
                .getRepository(Province)
                .createQueryBuilder('provinces')
                .select('provinces')
                .where(countryPk ? 'provinces.country_pk = :countryPk' : '1=1', { countryPk })
                .andWhere('provinces.archived=false')
                .orderBy('provinces.name')
                .getManyAndCount();

            return {
                status: true,
                data: provinces[0],
                total: provinces[1],
            };
        } catch (error) {
            return {
                status: false,
                code: 500,
            };
        }
    }

    findOne(id: number) {
        return `This action returns a #${id} province`;
    }

    update(id: number, updateProvinceDto: UpdateProvinceDto) {
        return `This action updates a #${id} province`;
    }

    remove(id: number) {
        return `This action removes a #${id} province`;
    }
}
