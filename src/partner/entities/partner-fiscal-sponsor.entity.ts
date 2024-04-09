import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToOne, ManyToOne, JoinColumn, BaseEntity, OneToMany, ManyToMany } from 'typeorm';
import { Partner } from './partner.entity';
import { Document } from 'src/document/entities/document.entity';

@Entity({ name: 'partner_fiscal_sponsors' })
export class PartnerFiscalSponsor extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ name: 'partner_pk', nullable: false })
    partner_pk: number;

    @Column({ type: 'text', nullable: false })
    name: string;

    @Column({ type: 'text', nullable: false })
    address: string;

    @Column({ type: 'text', nullable: false })
    head: string;

    @Column({ type: 'text', nullable: false })
    person_in_charge: string;

    @Column({ type: 'text', nullable: false })
    contact_number: string;

    @Column({ type: 'text', nullable: false })
    email_address: string;

    @Column({ type: 'text', nullable: false })
    bank_account_name: string;

    @Column({ type: 'text', nullable: false })
    account_number: string;

    @Column({ type: 'text', nullable: false })
    bank_name: string;

    @Column({ type: 'text', nullable: false })
    bank_branch: string;

    @Column({ type: 'text', nullable: false })
    bank_address: string;

    @Column({ type: 'text', nullable: false })
    swift_code: string;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    @Column({ default: false })
    archived: boolean;

    /**
     * Relationship
     */
    @OneToOne(type => Partner, partner => partner.partner_fiscal_sponsor, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'partner_pk' })
    partner: Partner;

    @ManyToMany(() => Document, (document) => document.partner_fiscal_sponsors, { cascade: ['insert', 'update'] })
    documents: Document[];
}
