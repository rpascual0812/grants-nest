import { MigrationInterface, QueryRunner } from "typeorm"

export class DefaultUser1690552484753 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            insert into users 
            (account_pk, uuid, last_name, first_name, middle_name, gender_pk, birthdate, mobile_number, email_address) 
            values 
            ((select pk from accounts where username = 'admin' limit 1), '4083c7ba-96d1-401e-a9bb-5cd3f99a742a', 'Pascual', 'Rafael', 'Aurelio', 1, '1986-08-12', '09162052424', 'rpascual0812@gmail.com');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            TRUNCATE TABLE users RESTART IDENTITY;
        `);
    }

}
