import { MigrationInterface, QueryRunner } from "typeorm"

export class Statuses1709366907433 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            insert into statuses 
            (parent_pk, name, description, sort, created_by) 
            values 
            (
                null,
                'Grant Application',
                '',
                1,
                (select pk from users order by pk desc limit 1)
            ),
            (
                null,
                'Contracting',
                '',
                2,
                (select pk from users order by pk desc limit 1)
            ),
            (
                null,
                'Interim Report',
                '',
                3,
                (select pk from users order by pk desc limit 1)
            ),
            (
                null,
                'Final Report',
                '',
                4,
                (select pk from users order by pk desc limit 1)
            ),
            (
                null,
                'Project Closing',
                '',
                5,
                (select pk from users order by pk desc limit 1)
            )
            ;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            TRUNCATE TABLE statuses RESTART IDENTITY cascade;
        `);
    }

}
