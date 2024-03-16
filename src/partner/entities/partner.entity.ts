import { Application } from 'src/application/entities/application.entity';
import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToOne, ManyToOne, JoinColumn, BaseEntity, OneToMany } from 'typeorm';
import { PartnerContact } from './partner-contacts.entity';
import { PartnerOrganization } from './partner-organization.entity';

@Entity({ name: 'partners' })
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
}
