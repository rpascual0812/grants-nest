import { Application } from 'src/application/entities/application.entity';
import { ApplicationOrganizationProfile } from 'src/application/entities/application-organization-profile.entity';
import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToOne, ManyToOne, JoinColumn, BaseEntity, OneToMany } from 'typeorm';
import { PartnerOrganization } from 'src/partner/entities/partner-organization.entity';

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
}
