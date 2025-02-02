import { Application } from 'src/application/entities/application.entity';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    Unique,
    OneToOne,
    ManyToOne,
    JoinColumn,
    BaseEntity,
    OneToMany,
} from 'typeorm';
import { PartnerOrganization } from 'src/partner/entities/partner-organization.entity';
import { OrganizationPartnerType } from './organization-partner-type.entity';

@Entity({ name: 'organizations' })
export class Organization extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ type: 'text', nullable: false })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ default: false })
    archived: boolean;

    /**
     * Relationship
     */
    @OneToMany('PartnerOrganization', (partner_organization: PartnerOrganization) => partner_organization.organization)
    @JoinColumn({ name: 'pk' })
    partner_organization: Array<PartnerOrganization>;

    @OneToMany(
        'OrganizationPartnerType',
        (organization_partner_type: OrganizationPartnerType) => organization_partner_type.organization,
    )
    @JoinColumn({ name: 'pk' })
    organization_partner_type: Array<OrganizationPartnerType>;
}
