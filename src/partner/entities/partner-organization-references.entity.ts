import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToOne, ManyToOne, JoinColumn, BaseEntity, OneToMany } from 'typeorm';
import { PartnerOrganization } from './partner-organization.entity';

@Entity({ name: 'partner_organization_references' })
@Unique(['partner_organization_pk', 'name', 'contact_number'])
export class PartnerOrganizationReference extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ name: 'partner_organization_pk', nullable: false })
    partner_organization_pk: number;

    @Column({ type: 'text', nullable: false })
    name: string;

    @Column({ type: 'text', nullable: false })
    contact_number: string;

    @Column({ type: 'text', nullable: false })
    email_address: string;

    @Column({ type: 'text', nullable: false })
    organization_name: string;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    /**
     * Relationship
     */
    @ManyToOne(type => PartnerOrganization, partner_organization => partner_organization.partner_organization_reference, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'partner_organization_pk' })
    partner_organization: PartnerOrganization;
}
