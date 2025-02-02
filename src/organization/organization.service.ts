import { Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import dataSource from 'db/data-source';
import { Organization } from './entities/organization.entity';
import { OrganizationPartnerType } from './entities/organization-partner-type.entity';

@Injectable()
export class OrganizationService {
    create(createOrganizationDto: CreateOrganizationDto) {
        return 'This action adds a new organization';
    }

    async findAll() {
        try {
            const organizations = await dataSource.manager
                .getRepository(Organization)
                .createQueryBuilder('organizations')
                .select('organizations')
                .where('organizations.archived=false')
                .orderBy('organizations.name')
                .getManyAndCount();

            return {
                status: true,
                data: organizations[0],
                total: organizations[1],
            };
        } catch (error) {
            return {
                status: false,
                code: 500,
            };
        }
    }

    async findOrganizationPartnerType() {
        try {
            const organizationPartnerTypes = await dataSource.manager
                .getRepository(OrganizationPartnerType)
                .createQueryBuilder('organization_partner_types')
                .select('organization_partner_types')
                .where('organization_partner_types.archived=false')
                .orderBy('organization_partner_types.type')
                .getManyAndCount();

            return {
                status: true,
                data: organizationPartnerTypes[0],
                total: organizationPartnerTypes[1],
            };
        } catch (error) {
            return {
                status: false,
                code: 500,
            };
        }
    }

    findOne(id: number) {
        return `This action returns a #${id} organization`;
    }

    update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
        return `This action updates a #${id} organization`;
    }

    remove(id: number) {
        return `This action removes a #${id} organization`;
    }
}
