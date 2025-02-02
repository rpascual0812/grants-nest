import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, BaseEntity, OneToMany } from 'typeorm';
import { Organization } from './organization.entity';
import { PartnerOrganization } from 'src/partner/entities/partner-organization.entity';

@Entity({ name: 'organization_partner_types' })
export class OrganizationPartnerType extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ name: 'organization_pk', nullable: false })
    organization_pk: number;

    @Column({ type: 'text', nullable: false })
    type: string;

    @Column({ type: 'text', nullable: false })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

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

    @OneToMany(
        'PartnerOrganization',
        (partner_organization: PartnerOrganization) => partner_organization.organization_partner_type,
    )
    @JoinColumn({ name: 'pk' })
    partner_organization: Array<PartnerOrganization>;
}
