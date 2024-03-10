import { MigrationInterface, QueryRunner } from "typeorm"

export class Province1710027082325 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO provinces (psgc_code,region_code,province_code,name,country_pk,active,user_pk,archived) VALUES
                (12800000,1,128,'ILOCOS NORTE',173,false,1,false),
                (12900000,1,129,'ILOCOS SUR',173,false,1,false),
                (13300000,1,133,'LA UNION',173,false,1,false),
                (15500000,1,155,'PANGASINAN',173,false,1,false),
                (20900000,2,209,'BATANES',173,false,1,false),
                (21500000,2,215,'CAGAYAN',173,false,1,false),
                (23100000,2,231,'ISABELA',173,false,1,false),
                (25000000,2,250,'NUEVA VIZCAYA',173,false,1,false),
                (25700000,2,257,'QUIRINO',173,false,1,false),
                (30800000,3,308,'BATAAN',173,false,1,false);
            INSERT INTO provinces (psgc_code,region_code,province_code,name,country_pk,active,user_pk,archived) VALUES
                (31400000,3,314,'BULACAN',173,false,1,false),
                (34900000,3,349,'NUEVA ECIJA',173,false,1,false),
                (35400000,3,354,'PAMPANGA',173,false,1,false),
                (36900000,3,369,'TARLAC',173,false,1,false),
                (37100000,3,371,'ZAMBALES',173,false,1,false),
                (37700000,3,377,'AURORA',173,false,1,false),
                (41000000,4,410,'BATANGAS',173,false,1,false),
                (42100000,4,421,'CAVITE',173,false,1,false),
                (43400000,4,434,'LAGUNA',173,false,1,false),
                (45600000,4,456,'QUEZON',173,false,1,false);
            INSERT INTO provinces (psgc_code,region_code,province_code,name,country_pk,active,user_pk,archived) VALUES
                (45800000,4,458,'RIZAL',173,false,1,false),
                (174000000,17,1740,'MARINDUQUE',173,false,1,false),
                (175100000,17,1751,'OCCIDENTAL MINDORO',173,false,1,false),
                (175200000,17,1752,'ORIENTAL MINDORO',173,false,1,false),
                (175300000,17,1753,'PALAWAN',173,false,1,false),
                (175900000,17,1759,'ROMBLON',173,false,1,false),
                (50500000,5,505,'ALBAY',173,false,1,false),
                (51600000,5,516,'CAMARINES NORTE',173,false,1,false),
                (51700000,5,517,'CAMARINES SUR',173,false,1,false),
                (52000000,5,520,'CATANDUANES',173,false,1,false);
            INSERT INTO provinces (psgc_code,region_code,province_code,name,country_pk,active,user_pk,archived) VALUES
                (54100000,5,541,'MASBATE',173,false,1,false),
                (56200000,5,562,'SORSOGON',173,false,1,false),
                (60400000,6,604,'AKLAN',173,false,1,false),
                (60600000,6,606,'ANTIQUE',173,false,1,false),
                (61900000,6,619,'CAPIZ',173,false,1,false),
                (63000000,6,630,'ILOILO',173,false,1,false),
                (64500000,6,645,'NEGROS OCCIDENTAL',173,false,1,false),
                (67900000,6,679,'GUIMARAS',173,false,1,false),
                (71200000,7,712,'BOHOL',173,false,1,false),
                (72200000,7,722,'CEBU',173,false,1,false);
            INSERT INTO provinces (psgc_code,region_code,province_code,name,country_pk,active,user_pk,archived) VALUES
                (74600000,7,746,'NEGROS ORIENTAL',173,false,1,false),
                (76100000,7,761,'SIQUIJOR',173,false,1,false),
                (82600000,8,826,'EASTERN SAMAR',173,false,1,false),
                (83700000,8,837,'LEYTE',173,false,1,false),
                (84800000,8,848,'NORTHERN SAMAR',173,false,1,false),
                (86000000,8,860,'SAMAR (WESTERN SAMAR)',173,false,1,false),
                (86400000,8,864,'SOUTHERN LEYTE',173,false,1,false),
                (87800000,8,878,'BILIRAN',173,false,1,false),
                (97200000,9,972,'ZAMBOANGA DEL NORTE',173,false,1,false),
                (97300000,9,973,'ZAMBOANGA DEL SUR',173,false,1,false);
            INSERT INTO provinces (psgc_code,region_code,province_code,name,country_pk,active,user_pk,archived) VALUES
                (98300000,9,983,'ZAMBOANGA SIBUGAY',173,false,1,false),
                (99700000,9,997,'CITY OF ISABELA',173,false,1,false),
                (101300000,10,1013,'BUKIDNON',173,false,1,false),
                (101800000,10,1018,'CAMIGUIN',173,false,1,false),
                (103500000,10,1035,'LANAO DEL NORTE',173,false,1,false),
                (104200000,10,1042,'MISAMIS OCCIDENTAL',173,false,1,false),
                (104300000,10,1043,'MISAMIS ORIENTAL',173,false,1,false),
                (112300000,11,1123,'DAVAO DEL NORTE',173,false,1,false),
                (112400000,11,1124,'DAVAO DEL SUR',173,false,1,false),
                (112500000,11,1125,'DAVAO ORIENTAL',173,false,1,false);
            INSERT INTO provinces (psgc_code,region_code,province_code,name,country_pk,active,user_pk,archived) VALUES
                (118200000,11,1182,'COMPOSTELA VALLEY',173,false,1,false),
                (118600000,11,1186,'DAVAO OCCIDENTAL',173,false,1,false),
                (124700000,12,1247,'COTABATO (NORTH COTABATO)',173,false,1,false),
                (126300000,12,1263,'SOUTH COTABATO',173,false,1,false),
                (126500000,12,1265,'SULTAN KUDARAT',173,false,1,false),
                (128000000,12,1280,'SARANGANI',173,false,1,false),
                (129800000,12,1298,'COTABATO CITY',173,false,1,false),
                (133900000,13,1339,'NCR, CITY OF MANILA, FIRST DISTRICT',173,false,1,false),
                (137400000,13,1374,'NCR, SECOND DISTRICT',173,false,1,false),
                (137500000,13,1375,'NCR, THIRD DISTRICT',173,false,1,false);
            INSERT INTO provinces (psgc_code,region_code,province_code,name,country_pk,active,user_pk,archived) VALUES
                (137600000,13,1376,'NCR, FOURTH DISTRICT',173,false,1,false),
                (140100000,14,1401,'ABRA',173,false,1,false),
                (141100000,14,1411,'BENGUET',173,false,1,false),
                (142700000,14,1427,'IFUGAO',173,false,1,false),
                (143200000,14,1432,'KALINGA',173,false,1,false),
                (144400000,14,1444,'MOUNTAIN PROVINCE',173,false,1,false),
                (148100000,14,1481,'APAYAO',173,false,1,false),
                (150700000,15,1507,'BASILAN',173,false,1,false),
                (153600000,15,1536,'LANAO DEL SUR',173,false,1,false),
                (153800000,15,1538,'MAGUINDANAO',173,false,1,false);
            INSERT INTO provinces (psgc_code,region_code,province_code,name,country_pk,active,user_pk,archived) VALUES
                (156600000,15,1566,'SULU',173,false,1,false),
                (157000000,15,1570,'TAWI-TAWI',173,false,1,false),
                (160200000,16,1602,'AGUSAN DEL NORTE',173,false,1,false),
                (160300000,16,1603,'AGUSAN DEL SUR',173,false,1,false),
                (166700000,16,1667,'SURIGAO DEL NORTE',173,false,1,false),
                (166800000,16,1668,'SURIGAO DEL SUR',173,false,1,false),
                (168500000,16,1685,'DINAGAT ISLANDS',173,false,1,false);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            TRUNCATE TABLE provinces RESTART IDENTITY cascade;
        `);
    }

}
