import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToOne, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { Partner } from './partner.entity';
import { User } from 'src/user/entities/user.entity';

@Entity({ name: 'partner_assessments' })
export class PartnerAssessment {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ name: 'partner_pk', nullable: false })
    partner_pk: number;

    @Column({ type: 'text', nullable: false })
    message: string;

    @Column({ name: 'created_by', nullable: false })
    created_by: number;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_updated: Date;

    @Column({ default: false })
    archived: boolean;

    /**
     * Relationship
     */

    @ManyToOne(type => Partner, partner => partner.assessments, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'partner_pk' })
    partner: Partner;

    @ManyToOne((type) => User, (user) => user.assessments, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'created_by' })
    user: User;
}
