import { MigrationInterface, QueryRunner } from 'typeorm';

export class OrganizationPartnerTypes1738045731303 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
                INSERT INTO organization_partner_types (organization_pk,type,name,description,archived) VALUES
                    (1,'a1','community women\'\'s group',null,false),
                    (1,'a2','community youth group',null,false),
                    (1,'a3','community diffable/ PWD group',null,false),
                    (1,'a4','community and indigenous group',null,false),
                    (1,'a5','community and grassroots/ rural group',null,false),
                    (1,'a6','community urban group',null,false);
                
                INSERT INTO organization_partner_types (organization_pk,type,name,description,archived) VALUES
                    (2,'b0','* operating at community/grassroots level, municipal or provincial level',null,false),
                    (2,'b1','indigenous peoples organization',null,false),
                    (2,'b2','Indigenous women\'\'s organization',null,false),
                    (2,'b3','Indigenous youth organization',null,false),
                    (2,'b4','Local women\'\'s org / women PO (non-IP)',null,false),
                    (2,'b5','PWD/ disability Peoples organization',null,false),
                    (2,'b6','farmers peoples organization (non-Indigenous)',null,false),
                    (2,'b6','fishers peoples organization (non-Indigenous)',null,false),
                    (2,'b6','urban peoples organization (sectoral)',null,false);

                INSERT INTO organization_partner_types (organization_pk,type,name,description,archived) VALUES
                    (3,'c1','indigenous NGO (51% IP, IP focused VMG)',null,false),
                    (3,'c2','Indigenous women\'\'s NGO',null,false),
                    (3,'c3','Indigenous youth NGO',null,false),
                    (3,'c4','Women NGO (non-IP) (51% women, women-focused VMG)',null,false),
                    (3,'c5','youth NGO (non-IP) (51% youth, youth-focused VMG)',null,false),
                    (3,'c6','PWD/ disability Peoples organization',null,false),
                    (3,'c7','farmers NGOs (non-Indigenous)',null,false),
                    (3,'c8','fishers NGO (non-Indigenous)',null,false),
                    (3,'c9','urban NGO (sectoral)',null,false);

                INSERT INTO organization_partner_types (organization_pk,type,name,description,archived) VALUES
                    (4,'d1','Faith-based/ Church-based',null,false),
                    (4,'d2','Academe and research org',null,false),
                    (4,'d3','Media ',null,false),
                    (4,'d4','charitable or civic (club)',null,false),
                    (4,'d5','government-affiliated',null,false),
                    (4,'d6','business or commerce affiliated',null,false),
                    (4,'d7','others',null,false);
            `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            TRUNCATE TABLE organization_partner_types RESTART IDENTITY cascade;
        `);
    }
}
