import { MigrationInterface, QueryRunner } from "typeorm"

export class UserRoles1690617561693 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            insert into roles 
            (name, details) 
            values 
            ('All', 'All possible roles'),
            ('Grant Programme Head', 'Programme Head')
            ;
        `);

        await queryRunner.query(`
            insert into user_roles 
            (user_pk, role_pk) 
            values 
            ((select pk from users order by pk desc limit 1), (select pk from roles where name = 'All'));
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
