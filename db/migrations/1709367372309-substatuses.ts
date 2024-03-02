import { MigrationInterface, QueryRunner } from "typeorm"

export class Substatuses1709367372309 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            insert into statuses 
            (parent_pk, name, description, sort, created_by) 
            values 
            (
                (select pk from statuses where name = 'Grant Application'),
                'Submission',
                '',
                1,
                (select pk from users order by pk desc limit 1)
            ),
            (
                (select pk from statuses where name = 'Grant Application'),
                'Grants Team Review',
                '',
                1,
                (select pk from users order by pk desc limit 1)
            ),
            (
                (select pk from statuses where name = 'Grant Application'),
                'Advisers Review',
                'An Organizational and financial due diligence for medium grants',
                1,
                (select pk from users order by pk desc limit 1)
            ),
            (
                (select pk from statuses where name = 'Grant Application'),
                'Budget review and finalization',
                'Financial management capacity due diligence',
                1,
                (select pk from users order by pk desc limit 1)
            ),
            (
                (select pk from statuses where name = 'Contracting'),
                'Bank Account Information',
                '',
                1,
                (select pk from users order by pk desc limit 1)
            ),
            (
                (select pk from statuses where name = 'Contracting'),
                'Signed Contract',
                '',
                2,
                (select pk from users order by pk desc limit 1)
            ),
            (
                (select pk from statuses where name = 'Contracting'),
                'First Tranche Payment',
                '',
                3,
                (select pk from users order by pk desc limit 1)
            ),
            (
                (select pk from statuses where name = 'Interim Report'),
                'Submitted',
                '',
                1,
                (select pk from users order by pk desc limit 1)
            ),
            (
                (select pk from statuses where name = 'Interim Report'),
                'Narrative approved',
                '',
                1,
                (select pk from users order by pk desc limit 1)
            ),
            (
                (select pk from statuses where name = 'Interim Report'),
                'Financial report approved',
                '',
                1,
                (select pk from users order by pk desc limit 1)
            ),
            (
                (select pk from statuses where name = 'Interim Report'),
                '2nd Tranche Payment',
                '',
                1,
                (select pk from users order by pk desc limit 1)
            ),
            (
                (select pk from statuses where name = 'Final Report'),
                'Submitted',
                '',
                1,
                (select pk from users order by pk desc limit 1)
            ),
            (
                (select pk from statuses where name = 'Final Report'),
                'Narrative approved',
                '',
                1,
                (select pk from users order by pk desc limit 1)
            ),
            (
                (select pk from statuses where name = 'Final Report'),
                'Financial report approved',
                '',
                1,
                (select pk from users order by pk desc limit 1)
            ),
            (
                (select pk from statuses where name = 'Final Report'),
                'Final Tranche Payment',
                '',
                1,
                (select pk from users order by pk desc limit 1)
            ),
            (
                (select pk from statuses where name = 'Project Closing'),
                'Closing Letter',
                '',
                1,
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
