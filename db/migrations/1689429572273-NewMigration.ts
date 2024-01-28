import { MigrationInterface, QueryRunner } from "typeorm"

export class NewMigration1689429572273 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            insert into accounts (username, password, verified) values ('admin', '$2b$10$XdV65n6N5LkEJHTdqErwGOWkO8sK0TMe5JE6fjo8BIpHMmMlPJsE.', true);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            TRUNCATE TABLE accounts RESTART IDENTITY;
        `);
    }
}
