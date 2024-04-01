import { Application } from 'src/application/entities/application.entity';
import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToOne, ManyToOne, JoinColumn, BaseEntity, OneToMany } from 'typeorm';
import { PartnerContact } from './partner-contacts.entity';
import { PartnerOrganization } from './partner-organization.entity';
import { PartnerFiscalSponsor } from './partner-fiscal-sponsor.entity';
import { PartnerNonprofitEquivalencyDetermination } from './partner-nonprofit-equivalency-determination.entity';

@Entity({ name: 'partners' })
@Unique(['partner_id'])
export class Partner extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ type: 'text', nullable: false })
    partner_id: string;

    @Column({ type: 'text', nullable: false })
    name: string;

    @Column({ type: 'text', nullable: true })
    address: string;

    @Column({ type: 'text', nullable: true })
    contact_number: string;

    @Column({ type: 'text', nullable: false })
    email_address: string;

    @Column({ type: 'text', nullable: true })
    website: string;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    @Column({ default: false })
    archived: boolean;

    /**
     * Relationship
     */
    @OneToMany('Application', (application: Application) => application.partner)
    @JoinColumn({ name: 'pk' })
    application: Array<Application>;

    @OneToMany('PartnerContact', (partner_contact: PartnerContact) => partner_contact.partner, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'pk' })
    contacts: PartnerContact;

    @OneToOne(type => PartnerOrganization, partner_organization => partner_organization.partner, { cascade: true })
    partner_organization: PartnerOrganization;

    @OneToOne(
        (type) => PartnerFiscalSponsor,
        (partner_fiscal_sponsor) => partner_fiscal_sponsor.partner,
        { cascade: true },
    )
    partner_fiscal_sponsor: PartnerFiscalSponsor;

    @OneToOne(
        (type) => PartnerNonprofitEquivalencyDetermination,
        (partner_nonprofit_equivalency_determination) =>
            partner_nonprofit_equivalency_determination.partner,
        { cascade: true },
    )
    partner_nonprofit_equivalency_determination: PartnerNonprofitEquivalencyDetermination;
}
