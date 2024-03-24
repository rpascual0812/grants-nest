import { Injectable } from '@nestjs/common';
import dataSource from 'db/data-source';
import { Type } from './entities/type.entity';

@Injectable()
export class TypeService {
    async findAll() {
        try {
            const partners = await dataSource.manager
                .getRepository(Type)
                .createQueryBuilder('types')
                .select()
                .where('archived=false')
                .orderBy('name')
                .getManyAndCount();

            return {
                status: true,
                data: partners[0],
                total: partners[1],
            };
        } catch (error) {
            console.log(error);
            return {
                status: false,
                code: 500,
            };
        }
    }
}
