import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToOne, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { Partner } from './partner.entity';

@Entity({ name: 'partner_contacts' })
export class PartnerContact {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ name: 'partner_pk', nullable: false })
    partner_pk: number;

    @Column({ type: 'text', nullable: false })
    name: string;

    @Column({ type: 'text', nullable: false })
    contact_number: string;

    @Column({ type: 'text', nullable: false })
    email_address: string;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    /**
     * Relationship
     */

    @ManyToOne(type => Partner, partner => partner.contacts, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'partner_pk' })
    partner: Partner;

}
