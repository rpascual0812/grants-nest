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
    JoinTable,
} from 'typeorm';
import { Project } from './project.entity';
import { Document } from 'src/document/entities/document.entity';
import { ProjectFundingReport } from './project-funding-report.entity';
import { ProjectFundingLiquidation } from './project-funding-liquidation.entity';

@Entity({ name: 'project_fundings' })
export class ProjectFunding extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ type: 'text', nullable: false })
    title: string;

    @Column({ name: 'project_pk', nullable: false })
    project_pk: number;

    @Column({ type: 'text', nullable: false })
    released_amount: string;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    released_date: Date;

    @Column({ name: 'bank_receipt_pk', nullable: true })
    bank_receipt_pk: number;

    @Column({ name: 'grantee_acknowledgement_pk', nullable: true })
    grantee_acknowledgement_pk: number;

    @Column({ name: 'created_by', nullable: false })
    created_by: number;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    report_due_date: Date;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_updated: Date;

    /**
     * Relationship
     */

    @ManyToOne((type) => Project, (project) => project.project_funding, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_pk' })
    project: Project;

    @OneToOne(type => Document, document => document.bank_receipt, { eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'bank_receipt_pk' })
    @JoinTable()
    bank_receipt_document: Document;

    @OneToOne(type => Document, document => document.grantee_acknowledgement, { eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'grantee_acknowledgement_pk' })
    @JoinTable()
    grantee_acknowledgement: Document;

    @OneToMany(
        'ProjectFundingReport',
        (projectFundingReport: ProjectFundingReport) => projectFundingReport.project_funding,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
    )
    @JoinColumn({ name: 'pk' })
    project_funding_report: ProjectFundingReport;

    @OneToOne(type => ProjectFundingLiquidation, project_funding_liquidation => project_funding_liquidation.project_funding, { cascade: true })
    project_funding_liquidation: ProjectFundingLiquidation;
}
