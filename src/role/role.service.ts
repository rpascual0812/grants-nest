import { Injectable } from '@nestjs/common';
import dataSource from 'db/data-source';

import { Role } from './entities/role.entity';
import { UserRole } from 'src/user/entities/user-role.entity';

@Injectable()
export class RoleService {

    async findAll(filters: any) {
        try {
            const users = await dataSource
                .manager
                .getRepository(Role)
                .createQueryBuilder('roles')
                .select('roles')
                .andWhere(
                    filters.hasOwnProperty('keyword') && filters.keyword != '' ?
                        "roles.name ILIKE :keyword" :
                        '1=1', { keyword: `%${filters.keyword}%` }
                )
                .andWhere("archived = false")
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
        try {
            if (data.checked) {
                return await dataSource
                    .createQueryBuilder()
                    .insert()
                    .into(UserRole)
                    .values([{
                        user_pk: data.user_pk,
                        role_pk: data.role_pk,
                    }])
                    .returning('*')
                    .execute();
            }
            else {
                return await dataSource
                    .manager
                    .getRepository(UserRole)
                    .createQueryBuilder()
                    .delete()
                    .from('user_roles')
                    .where({ user_pk: data.user_pk, role_pk: data.role_pk })
                    .execute()
                    ;
            }
        } catch (error) {
            console.log(error);
            // SAVE ERROR
            return {
                status: false
            }
        }
    }

}
