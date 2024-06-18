import { Injectable } from '@nestjs/common';
import dataSource from 'db/data-source';

import { Role } from './entities/role.entity';
import { UserRole } from 'src/user/entities/user-role.entity';
import { GlobalService } from 'src/utilities/global.service';

@Injectable()
export class RoleService extends GlobalService {
    async findAll(filters: any) {
        try {
            const users = await dataSource.manager
                .getRepository(Role)
                .createQueryBuilder('roles')
                .select('roles')
                .andWhere(
                    filters.hasOwnProperty('keyword') && filters.keyword != '' ? 'roles.name ILIKE :keyword' : '1=1',
                    { keyword: `%${filters.keyword}%` },
                )
                .andWhere('archived = false')
                .skip(filters.skip)
                .take(filters.take)
                .orderBy('roles.name', 'ASC')
                .getManyAndCount();
            return {
                status: true,
                data: users[0],
                total: users[1],
            };
        } catch (error) {
            console.log(error);
            // SAVE ERROR
            return {
                status: false,
            };
        }
    }

    async save(data: any, user: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                let existing = null;
                if (data.pk) {
                    existing = await EntityManager.findOne(Role, {
                        where: {
                            pk: data.pk,
                        },
                    });
                }

                const role = existing ? existing : new Role();
                role.name = data.name;
                role.details = data.details;

                const saved = await EntityManager.save(Role, {
                    ...role,
                });
                // save logs
                const model = { pk: saved.pk, name: 'roles', status: existing ? 'Updated' : 'Added', data: saved };
                await this.saveLog({ model, user });

                return { status: saved ? true : false };
            });
        } catch (error) {
            console.log(error);
            // SAVE ERROR
            return {
                status: false,
            };
        } finally {
            await queryRunner.release();
        }
    }

    async saveRestriction(data: any, user: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                await EntityManager.update(Role, { pk: data.pk }, { restrictions: data.restrictions });
            });
        } catch (error) {
            console.log(error);
            // SAVE ERROR
            return {
                status: false,
            };
        } finally {
            await queryRunner.release();
        }
    }

    async saveUserRole(data: any, user: any) {
        try {
            if (data.checked) {
                return await dataSource
                    .createQueryBuilder()
                    .insert()
                    .into(UserRole)
                    .values([
                        {
                            user_pk: data.user_pk,
                            role_pk: data.role_pk,
                        },
                    ])
                    .returning('*')
                    .execute();
            } else {
                return await dataSource.manager
                    .getRepository(UserRole)
                    .createQueryBuilder()
                    .delete()
                    .from('user_roles')
                    .where({ user_pk: data.user_pk, role_pk: data.role_pk })
                    .execute();
            }
        } catch (error) {
            console.log(error);
            // SAVE ERROR
            return {
                status: false,
            };
        }
    }
}
