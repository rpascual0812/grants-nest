import { Injectable } from '@nestjs/common';
import dataSource from 'db/data-source';
import { Donor } from './entities/donor.entity';
import { GlobalService } from 'src/utilities/global.service';
import { DateTime } from 'luxon';

@Injectable()
export class DonorService extends GlobalService {
    async findAll(filters: any) {
        try {
            const users = await dataSource
                .manager
                .getRepository(Donor)
                .createQueryBuilder('donors')
                .select()
                .andWhere(
                    filters.hasOwnProperty('keyword') && filters.keyword != '' ?
                        "donors.name ILIKE :keyword" :
                        '1=1', { keyword: `%${filters.keyword}%` }
                )
                .andWhere("archived = false")
                .skip(filters.skip)
                .take(filters.take)
                .getManyAndCount()
                ;

            return {
                status: true,
                data: users[0],
                total: users[1]
            }
        } catch (error) {
            console.log(error);
            // SAVE ERROR
            return {
                status: false
            }
        }
    }

    async save(data: any, user: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                let donor_pk = data.pk;
                let donor = null;
                if (data.pk) {
                    donor = await EntityManager.update(Donor, { pk: data.pk }, { ...data, date_updated: DateTime.now() });
                }
                else {
                    donor = await dataSource.manager
                        .getRepository(Donor)
                        .createQueryBuilder('donors')
                        .insert()
                        .into(Donor)
                        .values([
                            {
                                ...data,
                                created_by: user.pk
                            }
                        ])
                        .returning('pk')
                        .execute();

                    donor_pk = donor.generatedMaps[0].pk;
                }

                // save logs
                const model = { pk: donor_pk, name: 'donors', status: 'created' };
                await this.saveLog({ model, user });

                return { status: donor ? true : false, data: donor };
            });

        } catch (error) {
            console.log(error);
            // SAVE ERROR
            return {
                status: false
            }
        }
    }
}
