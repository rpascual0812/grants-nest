import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToOne, ManyToOne, JoinColumn, BaseEntity, OneToMany } from 'typeorm';
import { ApplicationProposal } from './application-proposal.entity';

@Entity({ name: 'application_proposal_activities' })
export class ApplicationProposalActivity extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ type: 'text', nullable: false })
    name: string;

    @Column({ type: 'text', nullable: false })
    duration: string;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    /**
     * Relationship
     */
    @ManyToOne(type => ApplicationProposal, application_proposal => application_proposal.application_proposal_activity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'application_proposal_pk' })
    application_proposal: ApplicationProposal;
}
