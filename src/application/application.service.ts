import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DateTime } from "luxon";

import dataSource from 'db/data-source';
import { Application } from './entities/application.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationProponent } from './entities/application-proponent.entity';
import { ApplicationOrganizationProfile } from './entities/application-organization-profile.entity';
import { GlobalService } from 'src/utilities/global.service';
import { Log } from 'src/log/entities/log.entity';

@Injectable()
export class ApplicationService extends GlobalService {
    uuid: string;

    constructor(
        @InjectRepository(Application)
        private applicationRepository: Repository<Application>,
    ) {
        super();
    }

    async fetch() {
        return await dataSource.manager
            .getRepository(Application)
            .createQueryBuilder('applications')
            .leftJoinAndSelect('applications.partner', 'partner')
            .leftJoinAndSelect('applications.application_proponent', 'application_proponents')
            .leftJoinAndSelect('applications.application_organization_profile', 'application_organization_profile')
            .leftJoinAndSelect('applications.application_project', 'application_projects')
            .where('applications.archived = false')
            .getMany();
    }

    fetchOne(pk: number) {
        return dataSource
            .getRepository(Application)
            .createQueryBuilder('applications')
            .leftJoinAndSelect('applications.partner', 'partner')
            .leftJoinAndSelect('applications.application_proponent', 'application_proponents')
            .leftJoinAndSelect('applications.application_organization_profile', 'application_organization_profile')
            .leftJoinAndSelect('applications.application_project', 'application_projects')
            .where('applications.pk = :pk', { pk })
            .andWhere('applications.archived = :archived', { archived: false })
            .getOne();
    }

    async generate(data: any, user: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            this.uuid = uuidv4();
            const date = DateTime.now();

            return await queryRunner.manager.transaction(async (EntityManager) => {
                const keyword = date.toFormat('yyLLdd');
                const latest = await dataSource.manager.getRepository(Application)
                    .createQueryBuilder("applications")
                    .where("number like :number", { number: `${keyword}%` })
                    .where("archived = false")
                    .orderBy("number", "DESC")
                    .getOne();

                let application_number = keyword + '00001';
                if (latest) {
                    let new_number = parseInt(latest.number.slice(6)) + 1;
                    application_number = keyword + new_number.toString().padStart(5, '0');
                }

                const obj: any = {
                    uuid: this.uuid,
                    number: application_number,
                    created_by: user.pk,
                    partner_pk: data.partner_pk,
                };

                const application = this.applicationRepository.create(obj);
                this.saveLog({});
                return this.applicationRepository.save(application);
            });
        } catch (err) {
            this.saveError({});
            return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }
    }

    async save(data: any, user: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                const application = await EntityManager.findOne(Application, {
                    where: { uuid: data.uuid },
                    relations: {
                        partner: true,
                    },
                });
                if (application) {
                    const applicationProponent = new ApplicationProponent();
                    applicationProponent.name = data.proponent.name;
                    applicationProponent.address = data.proponent.address;
                    applicationProponent.contact_number = data.proponent.contact_number;
                    applicationProponent.email_address = data.proponent.email_address;
                    applicationProponent.website = data.proponent.website;
                    applicationProponent.application_pk = application.pk;
                    const newApplicationProponent = await EntityManager.save(applicationProponent);

                    const applicationOrganizationProfile = new ApplicationOrganizationProfile();
                    applicationOrganizationProfile.organization_pk = data.organization_profile.organization_pk;
                    applicationOrganizationProfile.mission = data.organization_profile.mission;
                    applicationOrganizationProfile.vision = data.organization_profile.vision;
                    applicationOrganizationProfile.description = data.organization_profile.description;
                    applicationOrganizationProfile.country_pk = data.organization_profile.country_pk;
                    applicationOrganizationProfile.project_website = data.organization_profile.project_website;
                    applicationOrganizationProfile.application_pk = application.pk;
                    const newApplicationOrganizationProfile = await EntityManager.save(applicationOrganizationProfile);
                    this.saveLog({});

                    return {
                        status: true,
                        data: {
                            application,
                            newApplicationProponent,
                            newApplicationOrganizationProfile,
                        },
                    };
                } else {
                    return {
                        status: false,
                        code: 500,
                        message: 'Application not found',
                    };
                }
            });

        } catch (err) {
            this.saveError({});
            return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }
    }

    async remove(pk: number, user: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                EntityManager.update(Application, { pk }, { archived: true });

                // save logs
                const model = { pk, name: 'applications', status: 'deleted' };
                await this.saveLog({ model, user });

                return { status: true };
            });
        } catch (err) {
            this.saveError({});
            return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }
    }
}
