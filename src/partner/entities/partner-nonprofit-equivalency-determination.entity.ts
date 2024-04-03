import { User } from 'src/user/entities/user.entity';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    Unique,
    JoinColumn,
    ManyToOne,
    OneToOne,
    OneToMany,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { Document } from 'src/document/entities/document.entity';
import { Partner } from './partner.entity';

@Entity({ name: 'partner_nonprofit_equivalency_determinations' })
export class PartnerNonprofitEquivalencyDetermination {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ name: 'partner_pk', nullable: false })
    partner_pk: number;

    @Column({ type: 'date', nullable: false })
    year: Date;

    @Column({ type: 'decimal', name: 'financial_last_year_usd', nullable: false })
    financial_last_year_usd: number;

    @Column({ type: 'decimal', name: 'financial_last_year_other', nullable: false })
    financial_last_year_other: number;

    @Column({ type: 'text', nullable: false })
    financial_last_year_other_currency: string;

    @Column({ type: 'text', nullable: false })
    financial_last_year_source: string;

    @Column({ type: 'decimal', name: 'financial_current_usd', nullable: false })
    financial_current_usd: number;

    @Column({ type: 'decimal', name: 'financial_current_other', nullable: false })
    financial_current_other: number;

    @Column({ type: 'text', nullable: false })
    financial_current_other_currency: string;

    @Column({ type: 'text', nullable: false })
    financial_current_source: string;

    @Column({ type: 'text', nullable: false })
    officers: string;

    @Column({ type: 'text', nullable: false })
    members: string;

    @Column({ type: 'jsonb', nullable: true })
    operated_for: string;

    @Column({ type: 'text', nullable: false })
    operated_for_others: string;

    @Column({ default: false })
    any_assets: boolean;

    @Column({ type: 'text', nullable: false })
    any_assets_description: string;

    @Column({ default: false })
    any_payments: boolean;

    @Column({ type: 'text', nullable: false })
    any_payments_description: string;

    @Column({ default: false })
    upon_dissolution: boolean;

    @Column({ default: false })
    is_controlled_by: boolean;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    /**
     * Relationship
     */
    @OneToOne((type) => Partner, (partner) => partner.partner_nonprofit_equivalency_determination, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'partner_pk' })
    partner: Partner;
}
