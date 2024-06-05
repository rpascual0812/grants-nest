import { Injectable } from '@nestjs/common';
import dataSource from 'db/data-source';
import { Template } from './entities/template.entity';
import { GlobalService } from 'src/utilities/global.service';

@Injectable()
export class TemplateService extends GlobalService {
    async findAll() {
        try {
            const users = await dataSource
                .manager
                .getRepository(Template)
                .createQueryBuilder('templates')
                .select('templates')
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

    async find(type: string) {
        try {
            const template = await dataSource
                .manager
                .getRepository(Template)
                .createQueryBuilder('templates')
                .select('templates')
                .where("type = :type", { type })
                .getOne()
                ;

            return {
                status: true,
                data: template,
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
                // delete existing first
                let types = [];
                data.forEach((d: any) => {
                    types.push(d.type);
                });

                await dataSource
                    .createQueryBuilder()
                    .delete()
                    .from(Template)
                    .where("type IN (:...type)", { type: types })
                    .execute();

                data.forEach((d: any) => {
                    d.created_by = user.pk;
                });

                const template = await dataSource.manager
                    .getRepository(Template)
                    .createQueryBuilder('templates')
                    .createQueryBuilder()
                    .insert()
                    .into(Template)
                    .values(data)
                    .execute();

                // save logs
                // data.forEach((d: any) => { 
                //     const model = {
                //         pk: d.
                //         name: 'templates',
                //         status: 'updated',
                //         templates: JSON.stringify(data)
                //     };
                //     await this.saveLog({ model, user });
                // });

                return { status: template ? true : false };
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
