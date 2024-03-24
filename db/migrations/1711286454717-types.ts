import { MigrationInterface, QueryRunner } from "typeorm"

export class Types1711286454717 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            insert into types 
            (name, description, created_by) 
            values 
            (
                'Travel Grant',
                '',
                (select pk from users order by pk desc limit 1)
            ),
            (
                'Education Grant',
                '',
                (select pk from users order by pk desc limit 1)
            ),
            (
                'Social Justice Grant',
                '',
                (select pk from users order by pk desc limit 1)
            ),
            (
                'Capacity Development',
                '',
                (select pk from users order by pk desc limit 1)
            ),
            (
                'Indigenous Knowledge Building',
                '',
                (select pk from users order by pk desc limit 1)
            ),
            (
                'Institutional Development',
                '',
                (select pk from users order by pk desc limit 1)
            ),
            (
                'Urgent Action',
                '',
                (select pk from users order by pk desc limit 1)
            ),
            (
                'Resiliency Building',
                '',
                (select pk from users order by pk desc limit 1)
            )
            ;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            TRUNCATE TABLE types RESTART IDENTITY cascade;
        `);
    }

}
