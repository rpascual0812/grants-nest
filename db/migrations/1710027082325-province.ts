import { MigrationInterface, QueryRunner } from "typeorm"

export class Province1710027082325 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO provinces (psgc_code,region_code,region_name,province_code,iso_code,name,country_pk,active,user_pk,archived) VALUES
                (12800000,1,'Ilocos (Region I)',128,'PH-01','ILOCOS NORTE',173,false,1,false),
                (12900000,1,'Ilocos (Region I)',129,'PH-01','ILOCOS SUR',173,false,1,false),
                (13300000,1,'Ilocos (Region I)',133,'PH-01','LA UNION',173,false,1,false),
                (15500000,1,'Ilocos (Region I)',155,'PH-01','PANGASINAN',173,false,1,false),
                (20900000,2,'Cagayan Valley (Region II)',209,'PH-02','BATANES',173,false,1,false),
                (21500000,2,'Cagayan Valley (Region II)',215,'PH-02','CAGAYAN',173,false,1,false),
                (23100000,2,'Cagayan Valley (Region II)',231,'PH-02','ISABELA',173,false,1,false),
                (25000000,2,'Cagayan Valley (Region II)',250,'PH-02','NUEVA VIZCAYA',173,false,1,false),
                (25700000,2,'Cagayan Valley (Region II)',257,'PH-02','QUIRINO',173,false,1,false),
                (30800000,3,'Central Luzon (Region III)',308,'PH-03','BATAAN',173,false,1,false);
            INSERT INTO provinces (psgc_code,region_code,region_name,province_code,iso_code,name,country_pk,active,user_pk,archived) VALUES
                (31400000,3,'Central Luzon (Region III)',314,'PH-03','BULACAN',173,false,1,false),
                (34900000,3,'Central Luzon (Region III)',349,'PH-03','NUEVA ECIJA',173,false,1,false),
                (35400000,3,'Central Luzon (Region III)',354,'PH-03','PAMPANGA',173,false,1,false),
                (36900000,3,'Central Luzon (Region III)',369,'PH-03','TARLAC',173,false,1,false),
                (37100000,3,'Central Luzon (Region III)',371,'PH-03','ZAMBALES',173,false,1,false),
                (37700000,3,'Central Luzon (Region III)',377,'PH-03','AURORA',173,false,1,false),
                (41000000,4,'CALABARZON (Region IV-A)',410,'PH-40','BATANGAS',173,false,1,false),
                (42100000,4,'CALABARZON (Region IV-A)',421,'PH-40','CAVITE',173,false,1,false),
                (43400000,4,'CALABARZON (Region IV-A)',434,'PH-40','LAGUNA',173,false,1,false),
                (45600000,4,'CALABARZON (Region IV-A)',456,'PH-40','QUEZON',173,false,1,false);
            INSERT INTO provinces (psgc_code,region_code,region_name,province_code,iso_code,name,country_pk,active,user_pk,archived) VALUES
                (45800000,4,'CALABARZON (Region IV-A)',458,'PH-40','RIZAL',173,false,1,false),
                (174000000,17,'MIMAROPA (Region IV-B)',1740,'PH-41','MARINDUQUE',173,false,1,false),
                (175100000,17,'MIMAROPA (Region IV-B)',1751,'PH-41','OCCIDENTAL MINDORO',173,false,1,false),
                (175200000,17,'MIMAROPA (Region IV-B)',1752,'PH-41','ORIENTAL MINDORO',173,false,1,false),
                (175300000,17,'MIMAROPA (Region IV-B)',1753,'PH-41','PALAWAN',173,false,1,false),
                (175900000,17,'MIMAROPA (Region IV-B)',1759,'PH-41','ROMBLON',173,false,1,false),
                (50500000,5,'Bicol (Region V)',505,'PH-05','ALBAY',173,false,1,false),
                (51600000,5,'Bicol (Region V)',516,'PH-05','CAMARINES NORTE',173,false,1,false),
                (51700000,5,'Bicol (Region V)',517,'PH-05','CAMARINES SUR',173,false,1,false),
                (52000000,5,'Bicol (Region V)',520,'PH-05','CATANDUANES',173,false,1,false);
            INSERT INTO provinces (psgc_code,region_code,region_name,province_code,iso_code,name,country_pk,active,user_pk,archived) VALUES
                (54100000,5,'Bicol (Region V)',541,'PH-05','MASBATE',173,false,1,false),
                (56200000,5,'Bicol (Region V)',562,'PH-05','SORSOGON',173,false,1,false),
                (60400000,6,'Western Visayas (Region VI)',604,'PH-06','AKLAN',173,false,1,false),
                (60600000,6,'Western Visayas (Region VI)',606,'PH-06','ANTIQUE',173,false,1,false),
                (61900000,6,'Western Visayas (Region VI)',619,'PH-06','CAPIZ',173,false,1,false),
                (63000000,6,'Western Visayas (Region VI)',630,'PH-06','ILOILO',173,false,1,false),
                (64500000,6,'Western Visayas (Region VI)',645,'PH-06','NEGROS OCCIDENTAL',173,false,1,false),
                (67900000,6,'Western Visayas (Region VI)',679,'PH-06','GUIMARAS',173,false,1,false),
                (71200000,7,'Central Visayas (Region VII)',712,'PH-07','BOHOL',173,false,1,false),
                (72200000,7,'Central Visayas (Region VII)',722,'PH-07','CEBU',173,false,1,false);
            INSERT INTO provinces (psgc_code,region_code,region_name,province_code,iso_code,name,country_pk,active,user_pk,archived) VALUES
                (74600000,7,'Central Visayas (Region VII)',746,'PH-07','NEGROS ORIENTAL',173,false,1,false),
                (76100000,7,'Central Visayas (Region VII)',761,'PH-07','SIQUIJOR',173,false,1,false),
                (82600000,8,'Eastern Visayas (Region VIII)',826,'PH-08','EASTERN SAMAR',173,false,1,false),
                (83700000,8,'Eastern Visayas (Region VIII)',837,'PH-08','LEYTE',173,false,1,false),
                (84800000,8,'Eastern Visayas (Region VIII)',848,'PH-08','NORTHERN SAMAR',173,false,1,false),
                (86000000,8,'Eastern Visayas (Region VIII)',860,'PH-08','SAMAR (WESTERN SAMAR)',173,false,1,false),
                (86400000,8,'Eastern Visayas (Region VIII)',864,'PH-08','SOUTHERN LEYTE',173,false,1,false),
                (87800000,8,'Eastern Visayas (Region VIII)',878,'PH-08','BILIRAN',173,false,1,false),
                (97200000,9,'Zamboanga Peninsula (Region IX)',972,'PH-09','ZAMBOANGA DEL NORTE',173,false,1,false),
                (97300000,9,'Zamboanga Peninsula (Region IX)',973,'PH-09','ZAMBOANGA DEL SUR',173,false,1,false);
            INSERT INTO provinces (psgc_code,region_code,region_name,province_code,iso_code,name,country_pk,active,user_pk,archived) VALUES
                (98300000,9,'Zamboanga Peninsula (Region IX)',983,'PH-09','ZAMBOANGA SIBUGAY',173,false,1,false),
                (99700000,9,'Zamboanga Peninsula (Region IX)',997,'PH-09','CITY OF ISABELA',173,false,1,false),
                (101300000,10,'Northern Mindanao (Region X)',1013,'PH-10','BUKIDNON',173,false,1,false),
                (101800000,10,'Northern Mindanao (Region X)',1018,'PH-10','CAMIGUIN',173,false,1,false),
                (103500000,10,'Northern Mindanao (Region X)',1035,'PH-10','LANAO DEL NORTE',173,false,1,false),
                (104200000,10,'Northern Mindanao (Region X)',1042,'PH-10','MISAMIS OCCIDENTAL',173,false,1,false),
                (104300000,10,'Northern Mindanao (Region X)',1043,'PH-10','MISAMIS ORIENTAL',173,false,1,false),
                (112300000,11,'Davao (Region XI)',1123,'PH-11','DAVAO DEL NORTE',173,false,1,false),
                (112400000,11,'Davao (Region XI)',1124,'PH-11','DAVAO DEL SUR',173,false,1,false),
                (112500000,11,'Davao (Region XI)',1125,'PH-11','DAVAO ORIENTAL',173,false,1,false);
            INSERT INTO provinces (psgc_code,region_code,region_name,province_code,iso_code,name,country_pk,active,user_pk,archived) VALUES
                (118200000,11,'Davao (Region XI)',1182,'PH-11','COMPOSTELA VALLEY',173,false,1,false),
                (118600000,11,'Davao (Region XI)',1186,'PH-11','DAVAO OCCIDENTAL',173,false,1,false),
                (124700000,12,'SOCCSKSARGEN (Region XII)',1247,'PH-12','COTABATO (NORTH COTABATO)',173,false,1,false),
                (126300000,12,'SOCCSKSARGEN (Region XII)',1263,'PH-12','SOUTH COTABATO',173,false,1,false),
                (126500000,12,'SOCCSKSARGEN (Region XII)',1265,'PH-12','SULTAN KUDARAT',173,false,1,false),
                (128000000,12,'SOCCSKSARGEN (Region XII)',1280,'PH-12','SARANGANI',173,false,1,false),
                (129800000,12,'SOCCSKSARGEN (Region XII)',1298,'PH-12','COTABATO CITY',173,false,1,false),
                (133900000,13,'NCR',1339,'PH-00','NCR, CITY OF MANILA, FIRST DISTRICT',173,false,1,false),
                (137400000,13,'NCR',1374,'PH-00','NCR, SECOND DISTRICT',173,false,1,false),
                (137500000,13,'NCR',1375,'PH-00','NCR, THIRD DISTRICT',173,false,1,false);
            INSERT INTO provinces (psgc_code,region_code,region_name,province_code,iso_code,name,country_pk,active,user_pk,archived) VALUES
                (137600000,13,'NCR',1376,'PH-00','NCR, FOURTH DISTRICT',173,false,1,false),
                (140100000,14,'CAR',1401,'PH-15','ABRA',173,false,1,false),
                (141100000,14,'CAR',1411,'PH-15','BENGUET',173,false,1,false),
                (142700000,14,'CAR',1427,'PH-15','IFUGAO',173,false,1,false),
                (143200000,14,'CAR',1432,'PH-15','KALINGA',173,false,1,false),
                (144400000,14,'CAR',1444,'PH-15','MOUNTAIN PROVINCE',173,false,1,false),
                (148100000,14,'CAR',1481,'PH-15','APAYAO',173,false,1,false),
                (150700000,15,'ARMM',1507,'PH-14','BASILAN',173,false,1,false),
                (153600000,15,'ARMM',1536,'PH-14','LANAO DEL SUR',173,false,1,false),
                (153800000,15,'ARMM',1538,'PH-14','MAGUINDANAO',173,false,1,false);
            INSERT INTO provinces (psgc_code,region_code,region_name,province_code,iso_code,name,country_pk,active,user_pk,archived) VALUES
                (156600000,15,'ARMM',1566,'PH-14','SULU',173,false,1,false),
                (157000000,15,'ARMM',1570,'PH-14','TAWI-TAWI',173,false,1,false),
                (160200000,16,'Caraga (Region XIII)',1602,'PH-13','AGUSAN DEL NORTE',173,false,1,false),
                (160300000,16,'Caraga (Region XIII)',1603,'PH-13','AGUSAN DEL SUR',173,false,1,false),
                (166700000,16,'Caraga (Region XIII)',1667,'PH-13','SURIGAO DEL NORTE',173,false,1,false),
                (166800000,16,'Caraga (Region XIII)',1668,'PH-13','SURIGAO DEL SUR',173,false,1,false),
                (168500000,16,'Caraga (Region XIII)',1685,'PH-13','DINAGAT ISLANDS',173,false,1,false);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            TRUNCATE TABLE provinces RESTART IDENTITY cascade;
        `);
    }

}
