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
import { ProjectProposal } from './project-proposal.entity';


@Entity({ name: 'project_proposal_activities' })
export class ProjectProposalActivity extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ name: 'project_proposal_pk', nullable: false })
    project_proposal_pk: number;

    @Column({ type: 'text', nullable: false })
    name: string;

    @Column({ type: 'text', nullable: false })
    duration: string;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    /**
     * Relationship
     */
    @ManyToOne(
        (type) => ProjectProposal,
        (project_proposal) => project_proposal.project_proposal_activity,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
    )
    @JoinColumn({ name: 'project_proposal_pk' })
    project_proposal: ProjectProposal;
}
