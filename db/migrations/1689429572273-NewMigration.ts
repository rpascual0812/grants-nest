import { MigrationInterface, QueryRunner } from "typeorm"

export class NewMigration1689429572273 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            insert into accounts (username, password, verified) values ('admin', '$2b$10$zQaTm9vfET4odd0nQsLei.Tgke45X.wf5YVLDncznno3FbaMEUKLi', true);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            TRUNCATE TABLE accounts RESTART IDENTITY;
        `);
    }
}
