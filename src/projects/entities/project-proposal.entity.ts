import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    Unique,
    OneToOne,
    ManyToOne,
    JoinColumn,
    BaseEntity,
    OneToMany,
} from 'typeorm';
import { Project } from './project.entity';
import { ProjectProposalActivity } from './project-proposal-activity.entity';

@Entity({ name: 'project_proposals' })
export class ProjectProposal extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ name: 'project_pk', nullable: false })
    project_pk: number;

    @Column({ type: 'text', nullable: false })
    monitor: string;

    @Column({ type: 'decimal', name: 'budget_request_usd', nullable: false })
    budget_request_usd: number;

    @Column({ type: 'decimal', name: 'budget_request_other', nullable: false })
    budget_request_other: number;

    @Column({ type: 'text', nullable: false })
    budget_request_other_currency: string;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    /**
     * Relationship
     */

    @OneToOne((type) => Project, (project) => project.project_proposal, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_pk' })
    project: Project;

    @OneToMany(
        'ProjectProposalActivity',
        (projectProposalActivity: ProjectProposalActivity) => projectProposalActivity.project_proposal,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
    )
    @JoinColumn({ name: 'pk' })
    project_proposal_activity: ProjectProposalActivity;
}
