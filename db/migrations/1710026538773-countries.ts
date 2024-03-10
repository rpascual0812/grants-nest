import { MigrationInterface, QueryRunner } from "typeorm"

export class Countries1710026538773 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO countries (code,name,dial_code,currency_name,currency_symbol,currency_code,date_created,active,archived) VALUES
                ('AF','Afghanistan',93,'Afghan afghani','Ø‹','AFN','2022-11-23 12:31:59.487896+08',false,false),
                ('AL','Albania',355,'Albanian lek','L','ALL','2022-11-23 12:31:59.487896+08',false,false),
                ('DZ','Algeria',213,'Algerian dinar','Ø¯.Ø¬','DZD','2022-11-23 12:31:59.487896+08',false,false),
                ('AS','American Samoa',1684,'','','','2022-11-23 12:31:59.487896+08',false,false),
                ('AD','Andorra',376,'Euro','â‚¬','EUR','2022-11-23 12:31:59.487896+08',false,false),
                ('AO','Angola',244,'Angolan kwanza','Kz','AOA','2022-11-23 12:31:59.487896+08',false,false),
                ('AI','Anguilla',1264,'East Caribbean dolla','$','XCD','2022-11-23 12:31:59.487896+08',false,false),
                ('AQ','Antarctica',0,'','','','2022-11-23 12:31:59.487896+08',false,false),
                ('AG','Antigua And Barbuda',1268,'East Caribbean dolla','$','XCD','2022-11-23 12:31:59.487896+08',false,false),
                ('AR','Argentina',54,'Argentine peso','$','ARS','2022-11-23 12:31:59.487896+08',false,false);
            INSERT INTO countries (code,name,dial_code,currency_name,currency_symbol,currency_code,date_created,active,archived) VALUES
                ('AM','Armenia',374,'Armenian dram','','AMD','2022-11-23 12:31:59.487896+08',false,false),
                ('AW','Aruba',297,'Aruban florin','Æ’','AWG','2022-11-23 12:31:59.487896+08',false,false),
                ('AU','Australia',61,'Australian dollar','$','AUD','2022-11-23 12:31:59.487896+08',false,false),
                ('AT','Austria',43,'Euro','â‚¬','EUR','2022-11-23 12:31:59.487896+08',false,false),
                ('AZ','Azerbaijan',994,'Azerbaijani manat','','AZN','2022-11-23 12:31:59.487896+08',false,false),
                ('BS','Bahamas The',1242,'','','','2022-11-23 12:31:59.487896+08',false,false),
                ('BH','Bahrain',973,'Bahraini dinar','.Ø¯.Ø¨','BHD','2022-11-23 12:31:59.487896+08',false,false),
                ('BD','Bangladesh',880,'Bangladeshi taka','à§³','BDT','2022-11-23 12:31:59.487896+08',false,false),
                ('BB','Barbados',1246,'Barbadian dollar','$','BBD','2022-11-23 12:31:59.487896+08',false,false),
                ('BY','Belarus',375,'Belarusian ruble','Br','BYR','2022-11-23 12:31:59.487896+08',false,false);
            INSERT INTO countries (code,name,dial_code,currency_name,currency_symbol,currency_code,date_created,active,archived) VALUES
                ('BE','Belgium',32,'Euro','â‚¬','EUR','2022-11-23 12:31:59.487896+08',false,false),
                ('BZ','Belize',501,'Belize dollar','$','BZD','2022-11-23 12:31:59.487896+08',false,false),
                ('BJ','Benin',229,'West African CFA fra','Fr','XOF','2022-11-23 12:31:59.487896+08',false,false),
                ('BM','Bermuda',1441,'Bermudian dollar','$','BMD','2022-11-23 12:31:59.487896+08',false,false),
                ('BT','Bhutan',975,'Bhutanese ngultrum','Nu.','BTN','2022-11-23 12:31:59.487896+08',false,false),
                ('BO','Bolivia',591,'Bolivian boliviano','Bs.','BOB','2022-11-23 12:31:59.487896+08',false,false),
                ('BA','Bosnia and Herzegovina',387,'Bosnia and Herzegovi','KM or ÐšÐœ','BAM','2022-11-23 12:31:59.487896+08',false,false),
                ('BW','Botswana',267,'Botswana pula','P','BWP','2022-11-23 12:31:59.487896+08',false,false),
                ('BV','Bouvet Island',0,'','','','2022-11-23 12:31:59.487896+08',false,false),
                ('BR','Brazil',55,'Brazilian real','R$','BRL','2022-11-23 12:31:59.487896+08',false,false);
            INSERT INTO countries (code,name,dial_code,currency_name,currency_symbol,currency_code,date_created,active,archived) VALUES
                ('IO','British Indian Ocean Territory',246,'United States dollar','$','USD','2022-11-23 12:31:59.487896+08',false,false),
                ('BN','Brunei',673,'Brunei dollar','$','BND','2022-11-23 12:31:59.487896+08',false,false),
                ('BG','Bulgaria',359,'Bulgarian lev','Ð»Ð²','BGN','2022-11-23 12:31:59.487896+08',false,false),
                ('BF','Burkina Faso',226,'West African CFA fra','Fr','XOF','2022-11-23 12:31:59.487896+08',false,false),
                ('BI','Burundi',257,'Burundian franc','Fr','BIF','2022-11-23 12:31:59.487896+08',false,false),
                ('KH','Cambodia',855,'Cambodian riel','áŸ›','KHR','2022-11-23 12:31:59.487896+08',false,false),
                ('CM','Cameroon',237,'Central African CFA ','Fr','XAF','2022-11-23 12:31:59.487896+08',false,false),
                ('CA','Canada',1,'Canadian dollar','$','CAD','2022-11-23 12:31:59.487896+08',false,false),
                ('CV','Cape Verde',238,'Cape Verdean escudo','Esc or $','CVE','2022-11-23 12:31:59.487896+08',false,false),
                ('KY','Cayman Islands',1345,'Cayman Islands dolla','$','KYD','2022-11-23 12:31:59.487896+08',false,false);
            INSERT INTO countries (code,name,dial_code,currency_name,currency_symbol,currency_code,date_created,active,archived) VALUES
                ('CF','Central African Republic',236,'Central African CFA ','Fr','XAF','2022-11-23 12:31:59.487896+08',false,false),
                ('TD','Chad',235,'Central African CFA ','Fr','XAF','2022-11-23 12:31:59.487896+08',false,false),
                ('CL','Chile',56,'Chilean peso','$','CLP','2022-11-23 12:31:59.487896+08',false,false),
                ('CN','China',86,'Chinese yuan','Â¥ or å…ƒ','CNY','2022-11-23 12:31:59.487896+08',false,false),
                ('CX','Christmas Island',61,'','','','2022-11-23 12:31:59.487896+08',false,false),
                ('CC','Cocos (Keeling) Islands',672,'Australian dollar','$','AUD','2022-11-23 12:31:59.487896+08',false,false),
                ('CO','Colombia',57,'Colombian peso','$','COP','2022-11-23 12:31:59.487896+08',false,false),
                ('KM','Comoros',269,'Comorian franc','Fr','KMF','2022-11-23 12:31:59.487896+08',false,false),
                ('CG','Congo',242,'','','','2022-11-23 12:31:59.487896+08',false,false),
                ('CD','Congo The Democratic Republic Of The',242,'','','','2022-11-23 12:31:59.487896+08',false,false);
            INSERT INTO countries (code,name,dial_code,currency_name,currency_symbol,currency_code,date_created,active,archived) VALUES
                ('CK','Cook Islands',682,'New Zealand dollar','$','NZD','2022-11-23 12:31:59.487896+08',false,false),
                ('CR','Costa Rica',506,'Costa Rican colÃ³n','â‚¡','CRC','2022-11-23 12:31:59.487896+08',false,false),
                ('CI','Cote D''Ivoire (Ivory Coast)',225,'','','','2022-11-23 12:31:59.487896+08',false,false),
                ('HR','Croatia (Hrvatska)',385,'','','','2022-11-23 12:31:59.487896+08',false,false),
                ('CU','Cuba',53,'Cuban convertible pe','$','CUC','2022-11-23 12:31:59.487896+08',false,false),
                ('CY','Cyprus',357,'Euro','â‚¬','EUR','2022-11-23 12:31:59.487896+08',false,false),
                ('CZ','Czech Republic',420,'Czech koruna','KÄ','CZK','2022-11-23 12:31:59.487896+08',false,false),
                ('DK','Denmark',45,'Danish krone','kr','DKK','2022-11-23 12:31:59.487896+08',false,false),
                ('DJ','Djibouti',253,'Djiboutian franc','Fr','DJF','2022-11-23 12:31:59.487896+08',false,false),
                ('DM','Dominica',1767,'East Caribbean dolla','$','XCD','2022-11-23 12:31:59.487896+08',false,false);
            INSERT INTO countries (code,name,dial_code,currency_name,currency_symbol,currency_code,date_created,active,archived) VALUES
                ('DO','Dominican Republic',1809,'Dominican peso','$','DOP','2022-11-23 12:31:59.487896+08',false,false),
                ('TP','East Timor',670,'United States dollar','$','USD','2022-11-23 12:31:59.487896+08',false,false),
                ('EC','Ecuador',593,'United States dollar','$','USD','2022-11-23 12:31:59.487896+08',false,false),
                ('EG','Egypt',20,'Egyptian pound','Â£ or Ø¬.Ù…','EGP','2022-11-23 12:31:59.487896+08',false,false),
                ('SV','El Salvador',503,'United States dollar','$','USD','2022-11-23 12:31:59.487896+08',false,false),
                ('GQ','Equatorial Guinea',240,'Central African CFA ','Fr','XAF','2022-11-23 12:31:59.487896+08',false,false),
                ('ER','Eritrea',291,'Eritrean nakfa','Nfk','ERN','2022-11-23 12:31:59.487896+08',false,false),
                ('EE','Estonia',372,'Euro','â‚¬','EUR','2022-11-23 12:31:59.487896+08',false,false),
                ('ET','Ethiopia',251,'Ethiopian birr','Br','ETB','2022-11-23 12:31:59.487896+08',false,false),
                ('XA','External Territories of Australia',61,'','','','2022-11-23 12:31:59.487896+08',false,false);
            INSERT INTO countries (code,name,dial_code,currency_name,currency_symbol,currency_code,date_created,active,archived) VALUES
                ('FK','Falkland Islands',500,'Falkland Islands pou','Â£','FKP','2022-11-23 12:31:59.487896+08',false,false),
                ('FO','Faroe Islands',298,'Danish krone','kr','DKK','2022-11-23 12:31:59.487896+08',false,false),
                ('FJ','Fiji Islands',679,'','','','2022-11-23 12:31:59.487896+08',false,false),
                ('FI','Finland',358,'Euro','â‚¬','EUR','2022-11-23 12:31:59.487896+08',false,false),
                ('FR','France',33,'Euro','â‚¬','EUR','2022-11-23 12:31:59.487896+08',false,false),
                ('GF','French Guiana',594,'','','','2022-11-23 12:31:59.487896+08',false,false),
                ('PF','French Polynesia',689,'CFP franc','Fr','XPF','2022-11-23 12:31:59.487896+08',false,false),
                ('TF','French Southern Territories',0,'','','','2022-11-23 12:31:59.487896+08',false,false),
                ('GA','Gabon',241,'Central African CFA ','Fr','XAF','2022-11-23 12:31:59.487896+08',false,false),
                ('GM','Gambia The',220,'','','','2022-11-23 12:31:59.487896+08',false,false);
            INSERT INTO countries (code,name,dial_code,currency_name,currency_symbol,currency_code,date_created,active,archived) VALUES
                ('GE','Georgia',995,'Georgian lari','áƒš','GEL','2022-11-23 12:31:59.487896+08',false,false),
                ('DE','Germany',49,'Euro','â‚¬','EUR','2022-11-23 12:31:59.487896+08',false,false),
                ('GH','Ghana',233,'Ghana cedi','â‚µ','GHS','2022-11-23 12:31:59.487896+08',false,false),
                ('GI','Gibraltar',350,'Gibraltar pound','Â£','GIP','2022-11-23 12:31:59.487896+08',false,false),
                ('GR','Greece',30,'Euro','â‚¬','EUR','2022-11-23 12:31:59.487896+08',false,false),
                ('GL','Greenland',299,'','','','2022-11-23 12:31:59.487896+08',false,false),
                ('GD','Grenada',1473,'East Caribbean dolla','$','XCD','2022-11-23 12:31:59.487896+08',false,false),
                ('GP','Guadeloupe',590,'','','','2022-11-23 12:31:59.487896+08',false,false),
                ('GU','Guam',1671,'','','','2022-11-23 12:31:59.487896+08',false,false),
                ('GT','Guatemala',502,'Guatemalan quetzal','Q','GTQ','2022-11-23 12:31:59.487896+08',false,false);
            INSERT INTO countries (code,name,dial_code,currency_name,currency_symbol,currency_code,date_created,active,archived) VALUES
                ('XU','Guernsey and Alderney',44,'','','','2022-11-23 12:31:59.487896+08',false,false),
                ('GN','Guinea',224,'Guinean franc','Fr','GNF','2022-11-23 12:31:59.487896+08',false,false),
                ('GW','Guinea-Bissau',245,'West African CFA fra','Fr','XOF','2022-11-23 12:31:59.487896+08',false,false),
                ('GY','Guyana',592,'Guyanese dollar','$','GYD','2022-11-23 12:31:59.487896+08',false,false),
                ('HT','Haiti',509,'Haitian gourde','G','HTG','2022-11-23 12:31:59.487896+08',false,false),
                ('HM','Heard and McDonald Islands',0,'','','','2022-11-23 12:31:59.487896+08',false,false),
                ('HN','Honduras',504,'Honduran lempira','L','HNL','2022-11-23 12:31:59.487896+08',false,false),
                ('HK','Hong Kong S.A.R.',852,'','','','2022-11-23 12:31:59.487896+08',false,false),
                ('HU','Hungary',36,'Hungarian forint','Ft','HUF','2022-11-23 12:31:59.487896+08',false,false),
                ('IS','Iceland',354,'Icelandic krÃ³na','kr','ISK','2022-11-23 12:31:59.487896+08',false,false);
            INSERT INTO countries (code,name,dial_code,currency_name,currency_symbol,currency_code,date_created,active,archived) VALUES
                ('IN','India',91,'Indian rupee','â‚¹','INR','2022-11-23 12:31:59.487896+08',false,false),
                ('ID','Indonesia',62,'Indonesian rupiah','Rp','IDR','2022-11-23 12:31:59.487896+08',false,false),
                ('IR','Iran',98,'Iranian rial','ï·¼','IRR','2022-11-23 12:31:59.487896+08',false,false),
                ('IQ','Iraq',964,'Iraqi dinar','Ø¹.Ø¯','IQD','2022-11-23 12:31:59.487896+08',false,false),
                ('IE','Ireland',353,'Euro','â‚¬','EUR','2022-11-23 12:31:59.487896+08',false,false),
                ('IL','Israel',972,'Israeli new shekel','â‚ª','ILS','2022-11-23 12:31:59.487896+08',false,false),
                ('IT','Italy',39,'Euro','â‚¬','EUR','2022-11-23 12:31:59.487896+08',false,false),
                ('JM','Jamaica',1876,'Jamaican dollar','$','JMD','2022-11-23 12:31:59.487896+08',false,false),
                ('JP','Japan',81,'Japanese yen','Â¥','JPY','2022-11-23 12:31:59.487896+08',false,false),
                ('XJ','Jersey',44,'British pound','Â£','GBP','2022-11-23 12:31:59.487896+08',false,false);
            INSERT INTO countries (code,name,dial_code,currency_name,currency_symbol,currency_code,date_created,active,archived) VALUES
                ('JO','Jordan',962,'Jordanian dinar','Ø¯.Ø§','JOD','2022-11-23 12:31:59.487896+08',false,false),
                ('KZ','Kazakhstan',7,'Kazakhstani tenge','','KZT','2022-11-23 12:31:59.487896+08',false,false),
                ('KE','Kenya',254,'Kenyan shilling','Sh','KES','2022-11-23 12:31:59.487896+08',false,false),
                ('KI','Kiribati',686,'Australian dollar','$','AUD','2022-11-23 12:31:59.487896+08',false,false),
                ('KP','Korea North',850,'','','','2022-11-23 12:31:59.487896+08',false,false),
                ('KR','Korea South',82,'','','','2022-11-23 12:31:59.487896+08',false,false),
                ('KW','Kuwait',965,'Kuwaiti dinar','Ø¯.Ùƒ','KWD','2022-11-23 12:31:59.487896+08',false,false),
                ('KG','Kyrgyzstan',996,'Kyrgyzstani som','Ð»Ð²','KGS','2022-11-23 12:31:59.487896+08',false,false),
                ('LA','Laos',856,'Lao kip','â‚­','LAK','2022-11-23 12:31:59.487896+08',false,false),
                ('LV','Latvia',371,'Euro','â‚¬','EUR','2022-11-23 12:31:59.487896+08',false,false);
            INSERT INTO countries (code,name,dial_code,currency_name,currency_symbol,currency_code,date_created,active,archived) VALUES
                ('LB','Lebanon',961,'Lebanese pound','Ù„.Ù„','LBP','2022-11-23 12:31:59.487896+08',false,false),
                ('LS','Lesotho',266,'Lesotho loti','L','LSL','2022-11-23 12:31:59.487896+08',false,false),
                ('LR','Liberia',231,'Liberian dollar','$','LRD','2022-11-23 12:31:59.487896+08',false,false),
                ('LY','Libya',218,'Libyan dinar','Ù„.Ø¯','LYD','2022-11-23 12:31:59.487896+08',false,false),
                ('LI','Liechtenstein',423,'Swiss franc','Fr','CHF','2022-11-23 12:31:59.487896+08',false,false),
                ('LT','Lithuania',370,'Euro','â‚¬','EUR','2022-11-23 12:31:59.487896+08',false,false),
                ('LU','Luxembourg',352,'Euro','â‚¬','EUR','2022-11-23 12:31:59.487896+08',false,false),
                ('MO','Macau S.A.R.',853,'','','','2022-11-23 12:31:59.487896+08',false,false),
                ('MK','Macedonia',389,'','','','2022-11-23 12:31:59.487896+08',false,false),
                ('MG','Madagascar',261,'Malagasy ariary','Ar','MGA','2022-11-23 12:31:59.487896+08',false,false);
            INSERT INTO countries (code,name,dial_code,currency_name,currency_symbol,currency_code,date_created,active,archived) VALUES
                ('MW','Malawi',265,'Malawian kwacha','MK','MWK','2022-11-23 12:31:59.487896+08',false,false),
                ('MY','Malaysia',60,'Malaysian ringgit','RM','MYR','2022-11-23 12:31:59.487896+08',false,false),
                ('MV','Maldives',960,'Maldivian rufiyaa','.Þƒ','MVR','2022-11-23 12:31:59.487896+08',false,false),
                ('ML','Mali',223,'West African CFA fra','Fr','XOF','2022-11-23 12:31:59.487896+08',false,false),
                ('MT','Malta',356,'Euro','â‚¬','EUR','2022-11-23 12:31:59.487896+08',false,false),
                ('XM','Man (Isle of)',44,'','','','2022-11-23 12:31:59.487896+08',false,false),
                ('MH','Marshall Islands',692,'United States dollar','$','USD','2022-11-23 12:31:59.487896+08',false,false),
                ('MQ','Martinique',596,'','','','2022-11-23 12:31:59.487896+08',false,false),
                ('MR','Mauritania',222,'Mauritanian ouguiya','UM','MRO','2022-11-23 12:31:59.487896+08',false,false),
                ('MU','Mauritius',230,'Mauritian rupee','â‚¨','MUR','2022-11-23 12:31:59.487896+08',false,false);
            INSERT INTO countries (code,name,dial_code,currency_name,currency_symbol,currency_code,date_created,active,archived) VALUES
                ('YT','Mayotte',269,'','','','2022-11-23 12:31:59.487896+08',false,false),
                ('MX','Mexico',52,'Mexican peso','$','MXN','2022-11-23 12:31:59.487896+08',false,false),
                ('FM','Micronesia',691,'Micronesian dollar','$','','2022-11-23 12:31:59.487896+08',false,false),
                ('MD','Moldova',373,'Moldovan leu','L','MDL','2022-11-23 12:31:59.487896+08',false,false),
                ('MC','Monaco',377,'Euro','â‚¬','EUR','2022-11-23 12:31:59.487896+08',false,false),
                ('MN','Mongolia',976,'Mongolian tÃ¶grÃ¶g','â‚®','MNT','2022-11-23 12:31:59.487896+08',false,false),
                ('MS','Montserrat',1664,'East Caribbean dolla','$','XCD','2022-11-23 12:31:59.487896+08',false,false),
                ('MA','Morocco',212,'Moroccan dirham','Ø¯.Ù….','MAD','2022-11-23 12:31:59.487896+08',false,false),
                ('MZ','Mozambique',258,'Mozambican metical','MT','MZN','2022-11-23 12:31:59.487896+08',false,false),
                ('MM','Myanmar',95,'Burmese kyat','Ks','MMK','2022-11-23 12:31:59.487896+08',false,false);
            INSERT INTO countries (code,name,dial_code,currency_name,currency_symbol,currency_code,date_created,active,archived) VALUES
                ('NA','Namibia',264,'Namibian dollar','$','NAD','2022-11-23 12:31:59.487896+08',false,false),
                ('NR','Nauru',674,'Australian dollar','$','AUD','2022-11-23 12:31:59.487896+08',false,false),
                ('NP','Nepal',977,'Nepalese rupee','â‚¨','NPR','2022-11-23 12:31:59.487896+08',false,false),
                ('AN','Netherlands Antilles',599,'','','','2022-11-23 12:31:59.487896+08',false,false),
                ('NL','Netherlands The',31,'','','','2022-11-23 12:31:59.487896+08',false,false),
                ('NC','New Caledonia',687,'CFP franc','Fr','XPF','2022-11-23 12:31:59.487896+08',false,false),
                ('NZ','New Zealand',64,'New Zealand dollar','$','NZD','2022-11-23 12:31:59.487896+08',false,false),
                ('NI','Nicaragua',505,'Nicaraguan cÃ³rdoba','C$','NIO','2022-11-23 12:31:59.487896+08',false,false),
                ('NE','Niger',227,'West African CFA fra','Fr','XOF','2022-11-23 12:31:59.487896+08',false,false),
                ('NG','Nigeria',234,'Nigerian naira','â‚¦','NGN','2022-11-23 12:31:59.487896+08',false,false);
            INSERT INTO countries (code,name,dial_code,currency_name,currency_symbol,currency_code,date_created,active,archived) VALUES
                ('NU','Niue',683,'New Zealand dollar','$','NZD','2022-11-23 12:31:59.487896+08',false,false),
                ('NF','Norfolk Island',672,'','','','2022-11-23 12:31:59.487896+08',false,false),
                ('MP','Northern Mariana Islands',1670,'','','','2022-11-23 12:31:59.487896+08',false,false),
                ('NO','Norway',47,'Norwegian krone','kr','NOK','2022-11-23 12:31:59.487896+08',false,false),
                ('OM','Oman',968,'Omani rial','Ø±.Ø¹.','OMR','2022-11-23 12:31:59.487896+08',false,false),
                ('PK','Pakistan',92,'Pakistani rupee','â‚¨','PKR','2022-11-23 12:31:59.487896+08',false,false),
                ('PW','Palau',680,'Palauan dollar','$','','2022-11-23 12:31:59.487896+08',false,false),
                ('PS','Palestinian Territory Occupied',970,'','','','2022-11-23 12:31:59.487896+08',false,false),
                ('PA','Panama',507,'Panamanian balboa','B/.','PAB','2022-11-23 12:31:59.487896+08',false,false),
                ('PG','Papua new Guinea',675,'Papua New Guinean ki','K','PGK','2022-11-23 12:31:59.487896+08',false,false);
            INSERT INTO countries (code,name,dial_code,currency_name,currency_symbol,currency_code,date_created,active,archived) VALUES
                ('PY','Paraguay',595,'Paraguayan guaranÃ­','â‚²','PYG','2022-11-23 12:31:59.487896+08',false,false),
                ('PE','Peru',51,'Peruvian nuevo sol','S/.','PEN','2022-11-23 12:31:59.487896+08',false,false),
                ('PH','Philippines',63,'Philippine peso','₱','PHP','2022-11-23 12:31:59.487896+08',false,false),
                ('PN','Pitcairn Island',0,'','','','2022-11-23 12:31:59.487896+08',false,false),
                ('PL','Poland',48,'Polish zÅ‚oty','zÅ‚','PLN','2022-11-23 12:31:59.487896+08',false,false),
                ('PT','Portugal',351,'Euro','â‚¬','EUR','2022-11-23 12:31:59.487896+08',false,false),
                ('PR','Puerto Rico',1787,'','','','2022-11-23 12:31:59.487896+08',false,false),
                ('QA','Qatar',974,'Qatari riyal','Ø±.Ù‚','QAR','2022-11-23 12:31:59.487896+08',false,false),
                ('RE','Reunion',262,'','','','2022-11-23 12:31:59.487896+08',false,false),
                ('RO','Romania',40,'Romanian leu','lei','RON','2022-11-23 12:31:59.487896+08',false,false);
            INSERT INTO countries (code,name,dial_code,currency_name,currency_symbol,currency_code,date_created,active,archived) VALUES
                ('RU','Russia',70,'Russian ruble','','RUB','2022-11-23 12:31:59.487896+08',false,false),
                ('RW','Rwanda',250,'Rwandan franc','Fr','RWF','2022-11-23 12:31:59.487896+08',false,false),
                ('SH','Saint Helena',290,'Saint Helena pound','Â£','SHP','2022-11-23 12:31:59.487896+08',false,false),
                ('KN','Saint Kitts And Nevis',1869,'East Caribbean dolla','$','XCD','2022-11-23 12:31:59.487896+08',false,false),
                ('LC','Saint Lucia',1758,'East Caribbean dolla','$','XCD','2022-11-23 12:31:59.487896+08',false,false),
                ('PM','Saint Pierre and Miquelon',508,'','','','2022-11-23 12:31:59.487896+08',false,false),
                ('VC','Saint Vincent And The Grenadines',1784,'East Caribbean dolla','$','XCD','2022-11-23 12:31:59.487896+08',false,false),
                ('WS','Samoa',684,'Samoan tÄlÄ','T','WST','2022-11-23 12:31:59.487896+08',false,false),
                ('SM','San Marino',378,'Euro','â‚¬','EUR','2022-11-23 12:31:59.487896+08',false,false),
                ('ST','Sao Tome and Principe',239,'SÃ£o TomÃ© and PrÃ­ncip','Db','STD','2022-11-23 12:31:59.487896+08',false,false);
            INSERT INTO countries (code,name,dial_code,currency_name,currency_symbol,currency_code,date_created,active,archived) VALUES
                ('SA','Saudi Arabia',966,'Saudi riyal','Ø±.Ø³','SAR','2022-11-23 12:31:59.487896+08',false,false),
                ('SN','Senegal',221,'West African CFA fra','Fr','XOF','2022-11-23 12:31:59.487896+08',false,false),
                ('RS','Serbia',381,'Serbian dinar','Ð´Ð¸Ð½. or din.','RSD','2022-11-23 12:31:59.487896+08',false,false),
                ('SC','Seychelles',248,'Seychellois rupee','â‚¨','SCR','2022-11-23 12:31:59.487896+08',false,false),
                ('SL','Sierra Leone',232,'Sierra Leonean leone','Le','SLL','2022-11-23 12:31:59.487896+08',false,false),
                ('SG','Singapore',65,'Brunei dollar','$','BND','2022-11-23 12:31:59.487896+08',false,false),
                ('SK','Slovakia',421,'Euro','â‚¬','EUR','2022-11-23 12:31:59.487896+08',false,false),
                ('SI','Slovenia',386,'Euro','â‚¬','EUR','2022-11-23 12:31:59.487896+08',false,false),
                ('XG','Smaller Territories of the UK',44,'','','','2022-11-23 12:31:59.487896+08',false,false),
                ('SB','Solomon Islands',677,'Solomon Islands doll','$','SBD','2022-11-23 12:31:59.487896+08',false,false);
            INSERT INTO countries (code,name,dial_code,currency_name,currency_symbol,currency_code,date_created,active,archived) VALUES
                ('SO','Somalia',252,'Somali shilling','Sh','SOS','2022-11-23 12:31:59.487896+08',false,false),
                ('ZA','South Africa',27,'South African rand','R','ZAR','2022-11-23 12:31:59.487896+08',false,false),
                ('GS','South Georgia',0,'','','','2022-11-23 12:31:59.487896+08',false,false),
                ('SS','South Sudan',211,'South Sudanese pound','Â£','SSP','2022-11-23 12:31:59.487896+08',false,false),
                ('ES','Spain',34,'Euro','â‚¬','EUR','2022-11-23 12:31:59.487896+08',false,false),
                ('LK','Sri Lanka',94,'Sri Lankan rupee','Rs or à¶»à·”','LKR','2022-11-23 12:31:59.487896+08',false,false),
                ('SD','Sudan',249,'Sudanese pound','Ø¬.Ø³.','SDG','2022-11-23 12:31:59.487896+08',false,false),
                ('SR','Suriname',597,'Surinamese dollar','$','SRD','2022-11-23 12:31:59.487896+08',false,false),
                ('SJ','Svalbard And Jan Mayen Islands',47,'','','','2022-11-23 12:31:59.487896+08',false,false),
                ('SZ','Swaziland',268,'Swazi lilangeni','L','SZL','2022-11-23 12:31:59.487896+08',false,false);
            INSERT INTO countries (code,name,dial_code,currency_name,currency_symbol,currency_code,date_created,active,archived) VALUES
                ('SE','Sweden',46,'Swedish krona','kr','SEK','2022-11-23 12:31:59.487896+08',false,false),
                ('CH','Switzerland',41,'Swiss franc','Fr','CHF','2022-11-23 12:31:59.487896+08',false,false),
                ('SY','Syria',963,'Syrian pound','Â£ or Ù„.Ø³','SYP','2022-11-23 12:31:59.487896+08',false,false),
                ('TW','Taiwan',886,'New Taiwan dollar','$','TWD','2022-11-23 12:31:59.487896+08',false,false),
                ('TJ','Tajikistan',992,'Tajikistani somoni','Ð…Ðœ','TJS','2022-11-23 12:31:59.487896+08',false,false),
                ('TZ','Tanzania',255,'Tanzanian shilling','Sh','TZS','2022-11-23 12:31:59.487896+08',false,false),
                ('TH','Thailand',66,'Thai baht','à¸¿','THB','2022-11-23 12:31:59.487896+08',false,false),
                ('TG','Togo',228,'West African CFA fra','Fr','XOF','2022-11-23 12:31:59.487896+08',false,false),
                ('TK','Tokelau',690,'','','','2022-11-23 12:31:59.487896+08',false,false),
                ('TO','Tonga',676,'Tongan paÊ»anga','T$','TOP','2022-11-23 12:31:59.487896+08',false,false);
            INSERT INTO countries (code,name,dial_code,currency_name,currency_symbol,currency_code,date_created,active,archived) VALUES
                ('TT','Trinidad And Tobago',1868,'Trinidad and Tobago ','$','TTD','2022-11-23 12:31:59.487896+08',false,false),
                ('TN','Tunisia',216,'Tunisian dinar','Ø¯.Øª','TND','2022-11-23 12:31:59.487896+08',false,false),
                ('TR','Turkey',90,'Turkish lira','','TRY','2022-11-23 12:31:59.487896+08',false,false),
                ('TM','Turkmenistan',7370,'Turkmenistan manat','m','TMT','2022-11-23 12:31:59.487896+08',false,false),
                ('TC','Turks And Caicos Islands',1649,'United States dollar','$','USD','2022-11-23 12:31:59.487896+08',false,false),
                ('TV','Tuvalu',688,'Australian dollar','$','AUD','2022-11-23 12:31:59.487896+08',false,false),
                ('UG','Uganda',256,'Ugandan shilling','Sh','UGX','2022-11-23 12:31:59.487896+08',false,false),
                ('UA','Ukraine',380,'Ukrainian hryvnia','â‚´','UAH','2022-11-23 12:31:59.487896+08',false,false),
                ('AE','United Arab Emirates',971,'United Arab Emirates','Ø¯.Ø¥','AED','2022-11-23 12:31:59.487896+08',false,false),
                ('GB','United Kingdom',44,'British pound','Â£','GBP','2022-11-23 12:31:59.487896+08',false,false);
            INSERT INTO countries (code,name,dial_code,currency_name,currency_symbol,currency_code,date_created,active,archived) VALUES
                ('US','United States',1,'United States dollar','$','USD','2022-11-23 12:31:59.487896+08',false,false),
                ('UM','United States Minor Outlying Islands',1,'','','','2022-11-23 12:31:59.487896+08',false,false),
                ('UY','Uruguay',598,'Uruguayan peso','$','UYU','2022-11-23 12:31:59.487896+08',false,false),
                ('UZ','Uzbekistan',998,'Uzbekistani som','','UZS','2022-11-23 12:31:59.487896+08',false,false),
                ('VU','Vanuatu',678,'Vanuatu vatu','Vt','VUV','2022-11-23 12:31:59.487896+08',false,false),
                ('VA','Vatican City State (Holy See)',39,'','','','2022-11-23 12:31:59.487896+08',false,false),
                ('VE','Venezuela',58,'Venezuelan bolÃ­var','Bs F','VEF','2022-11-23 12:31:59.487896+08',false,false),
                ('VN','Vietnam',84,'Vietnamese Ä‘á»“ng','â‚«','VND','2022-11-23 12:31:59.487896+08',false,false),
                ('VG','Virgin Islands (British)',1284,'','','','2022-11-23 12:31:59.487896+08',false,false),
                ('VI','Virgin Islands (US)',1340,'','','','2022-11-23 12:31:59.487896+08',false,false);
            INSERT INTO countries (code,name,dial_code,currency_name,currency_symbol,currency_code,date_created,active,archived) VALUES
                ('WF','Wallis And Futuna Islands',681,'','','','2022-11-23 12:31:59.487896+08',false,false),
                ('EH','Western Sahara',212,'','','','2022-11-23 12:31:59.487896+08',false,false),
                ('YE','Yemen',967,'Yemeni rial','ï·¼','YER','2022-11-23 12:31:59.487896+08',false,false),
                ('YU','Yugoslavia',38,'','','','2022-11-23 12:31:59.487896+08',false,false),
                ('ZM','Zambia',260,'Zambian kwacha','ZK','ZMW','2022-11-23 12:31:59.487896+08',false,false),
                ('ZW','Zimbabwe',263,'Botswana pula','P','BWP','2022-11-23 12:31:59.487896+08',false,false);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            TRUNCATE TABLE countries RESTART IDENTITY cascade;
        `);
    }

}
