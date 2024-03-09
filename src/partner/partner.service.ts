import { Injectable } from '@nestjs/common';
import dataSource from 'db/data-source';
import { Partner } from './entities/partner.entity';

@Injectable()
export class PartnerService {

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

    async find(pk: number) {
        return await dataSource.manager
            .getRepository(Partner)
            .createQueryBuilder('partners')
            .where('partners.pk = :pk', { pk })
            .where('partners.archived = false')
            .getOne();
    }

    async save(data: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        console.log('saving link', data);
        try {
            return await queryRunner.manager.transaction(
                async (EntityManager) => {


                    return { status: true, data: {} };
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
