import { MigrationInterface, QueryRunner } from "typeorm"

export class NewOrganizations1708730674339 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            insert into organizations 
            (name) 
            values 
            ('Community/informal group'),
            ('Local organization/People\'\'s organization'),
            ('Non-Government organization'),
            ('Other organizations');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            TRUNCATE TABLE organizations RESTART IDENTITY cascade;
        `);
    }

}
