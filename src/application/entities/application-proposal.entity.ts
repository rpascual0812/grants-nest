import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToOne, ManyToOne, JoinColumn, BaseEntity, OneToMany } from 'typeorm';
import { Application } from './application.entity';
import { ApplicationProposalActivity } from './application-proposal-activity.entity';

@Entity({ name: 'application_proposal' })
export class ApplicationProposal extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ name: 'application_pk', nullable: false })
    application_pk: number;

    @Column({ type: 'text', nullable: false })
    monitor: string;

    @Column({ name: 'budget_request_usd', nullable: false })
    budget_request_usd: number;

    @Column({ type: 'money', name: 'budget_request_other', nullable: false })
    budget_request_other: number;

    @Column({ type: 'text', nullable: false })
    budget_request_other_currency: string;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    /**
     * Relationship
     */

    @OneToOne(type => Application, application => application.application_proposal, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'application_pk' })
    application: Application;

    @OneToMany('ApplicationProposalActivity', (applicationProposalActivity: ApplicationProposalActivity) => applicationProposalActivity.application_proposal, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'pk' })
    application_proposal_activity: ApplicationProposalActivity;
}
