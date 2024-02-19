import { Injectable } from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import dataSource from 'db/data-source';
import { Country } from './entities/country.entity';

@Injectable()
export class CountryService {
    create(createCountryDto: CreateCountryDto) {
        return 'This action adds a new country';
    }

    async findAll() {
        try {
            const countries = await dataSource.manager
                .getRepository(Country)
                .createQueryBuilder('countries')
                .select('countries')
                .where('countries.archived=false')
                .orderBy('countries.name')
                .getManyAndCount();

            return {
                status: true,
                data: countries[0],
                total: countries[1],
            };
        } catch (error) {
            return {
                status: false,
                code: 500,
            };
        }
    }

    findOne(id: number) {
        return `This action returns a #${id} country`;
    }

    update(id: number, updateCountryDto: UpdateCountryDto) {
        return `This action updates a #${id} country`;
    }

    remove(id: number) {
        return `This action removes a #${id} country`;
    }
}
