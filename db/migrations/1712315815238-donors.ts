import { MigrationInterface, QueryRunner } from "typeorm"

export class Donors1712315815238 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            insert into donors 
            (name, code, active, created_by) 
            values 
            (
                'Global Greengrants Fund/GGF',
                '',
                false,
                (select pk from users order by pk desc limit 1)
            ),
            (
                'Foundation for the Philippine Environment/FPE',
                '',
                false,
                (select pk from users order by pk desc limit 1)
            ),
            (
                'Ford Foundation',
                '',
                true,
                (select pk from users order by pk desc limit 1)
            ),
            (
                'Climate Land Use Alliance/CLUA',
                '',
                false,
                (select pk from users order by pk desc limit 1)
            ),
            (
                'CLUA (for FOKER LSM Papua)',
                '',
                false,
                (select pk from users order by pk desc limit 1)
            ),
            (
                'American Jewish World Services/AJWS',
                '',
                true,
                (select pk from users order by pk desc limit 1)
            )
            ;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            TRUNCATE TABLE donors RESTART IDENTITY cascade;
        `);
    }

}
