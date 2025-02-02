import { Country } from 'src/country/entities/country.entity';
import { Organization } from 'src/organization/entities/organization.entity';
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
import { Partner } from './partner.entity';
import { PartnerOrganizationReference } from './partner-organization-references.entity';
import { PartnerOrganizationBank } from './partner-organization-bank.entity';
import { PartnerOrganizationOtherInformation } from './partner-organization-other-information.entity';
import { OrganizationPartnerType } from 'src/organization/entities/organization-partner-type.entity';

@Entity({ name: 'partner_organizations' })
export class PartnerOrganization extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ name: 'partner_pk', nullable: false })
    partner_pk: number;

    @Column({ name: 'organization_pk', nullable: true })
    organization_pk: number;

    @Column({ name: 'organization_partner_type_pk', nullable: true })
    organization_partner_type_pk: number;

    @Column({ type: 'text', nullable: true })
    tribe: string;

    @Column({ default: false })
    womens_organization: boolean;

    @Column({ default: false })
    youth_organization: boolean;

    @Column({ default: false })
    differently_abled_organization: boolean;

    @Column({ type: 'text', nullable: true })
    other_sectoral_group: string;

    @Column({ default: false })
    farmers_group: boolean;

    @Column({ default: false })
    fisherfolks: boolean;

    @Column({ type: 'text', nullable: false })
    mission: string;

    @Column({ type: 'text', nullable: false })
    vision: string;

    @Column({ type: 'text', nullable: false })
    description: string;

    @Column({ name: 'country_pk', nullable: true })
    country_pk: number;

    @Column({ type: 'text', nullable: false })
    project_website: string;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    @Column({ default: false })
    archived: boolean;

    /**
     * Relationship
     */
    @ManyToOne('Organization', (organization: Organization) => organization.partner_organization, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'organization_pk' })
    organization: Organization;

    @ManyToOne(
        'OrganizationPartnerType',
        (organization_partner_type: OrganizationPartnerType) => organization_partner_type.partner_organization,
        {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
    )
    @JoinColumn({ name: 'organization_partner_type_pk' })
    organization_partner_type: OrganizationPartnerType;

    @ManyToOne('Country', (country: Country) => country.partner_organization, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'country_pk' })
    country: Country;

    @OneToOne((type) => Partner, (partner) => partner.partner_organization, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'partner_pk' })
    partner: Partner;

    @OneToMany(
        'PartnerOrganizationReference',
        (partnerOrganizationReference: PartnerOrganizationReference) =>
            partnerOrganizationReference.partner_organization,
    )
    @JoinColumn({ name: 'pk' })
    partner_organization_reference: Array<PartnerOrganizationReference>;

    @OneToMany(
        'PartnerOrganizationBank',
        (partner_organization_bank: PartnerOrganizationBank) => partner_organization_bank.partner_organization,
    )
    @JoinColumn({ name: 'pk' })
    partner_organization_bank: Array<PartnerOrganizationBank>;

    @OneToMany(
        'PartnerOrganizationOtherInformation',
        (partner_organization_other_information: PartnerOrganizationOtherInformation) =>
            partner_organization_other_information.partner_organization,
    )
    @JoinColumn({ name: 'pk' })
    partner_organization_other_information: Array<PartnerOrganizationOtherInformation>;
}
