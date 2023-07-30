import { MigrationInterface, QueryRunner } from "typeorm"

export class Genders1690600410513 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            insert into genders 
            (name) 
            values 
            ('Male'),
            ('Female'),
            ('Prefer not to say');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            TRUNCATE TABLE genders RESTART IDENTITY cascade;
        `);
    }

}
