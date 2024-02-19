import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import dataSource from 'db/data-source';
import { Application } from './entities/application.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationProponent } from './entities/application-proponent.entity';
import { ApplicationOrganizationProfile } from './entities/application-organization-profile.entity';

@Injectable()
export class ApplicationService {
    uuid: string;

    constructor(
        @InjectRepository(Application)
        private applicationRepository: Repository<Application>,
    ) {}

    async fetch() {
        return await dataSource.manager
            .getRepository(Application)
            .createQueryBuilder('applications')
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
            .leftJoinAndSelect('applications.application_proponent', 'application_proponents')
            .leftJoinAndSelect('applications.application_organization_profile', 'application_organization_profile')
            .leftJoinAndSelect('applications.application_project', 'application_projects')
            .where('applications.pk = :pk', { pk })
            .andWhere('applications.archived = :archived', { archived: false })
            .getOne();
    }

    async generate(user: any) {
        this.uuid = uuidv4();

        const obj: any = {
            uuid: this.uuid,
            created_by: user.pk,
        };

        const application = this.applicationRepository.create(obj);
        return this.applicationRepository.save(application);
    }

    async save(data: any, user: any) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.manager.transaction(async (EntityManager) => {
                const application = await EntityManager.findOne(Application, {
                    where: { uuid: data.uuid },
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
            console.log(err);
            return { status: false, code: err.code };
        } finally {
            await queryRunner.release();
        }
    }

    remove(id: number) {
        return `This action removes a #${id} application`;
    }
}
