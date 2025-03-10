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
import { Donor } from 'src/donor/entities/donor.entity';
import { ProjectCode } from './project-code.entity';

@Entity({ name: 'project_fundings' })
export class ProjectFunding extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ name: 'donor_pk', nullable: true })
    donor_pk: number;

    @Column({ type: 'text', nullable: false })
    title: string;

    @Column({ name: 'project_pk', nullable: false })
    project_pk: number;

    @Column({ type: 'decimal', nullable: false })
    released_amount_usd: number;

    @Column({ type: 'decimal', nullable: false })
    released_amount_other: number;

    @Column({ type: 'text', nullable: false })
    released_amount_other_currency: string;

    @Column({ type: 'date', nullable: true })
    released_date: Date;

    @Column({ name: 'bank_receipt_pk', nullable: true })
    bank_receipt_pk: number;

    @Column({ type: 'date', nullable: true })
    grantee_acknowledgement: Date;

    @Column({ name: 'created_by', nullable: false })
    created_by: number;

    @Column({ type: 'date', nullable: true })
    report_due_date: Date;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_updated: Date;

    /**
     * Relationship
     */

    @ManyToOne((type) => Donor, (donor) => donor.project_funding, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'donor_pk' })
    donor: Donor;

    @ManyToOne((type) => Project, (project) => project.project_funding, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_pk' })
    project: Project;

    @OneToOne((type) => Document, (document) => document.bank_receipt, {
        eager: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'bank_receipt_pk' })
    @JoinTable()
    bank_receipt_document: Document;

    // @OneToOne(type => Document, document => document.grantee_acknowledgement, { eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    // @JoinColumn({ name: 'grantee_acknowledgement_pk' })
    // @JoinTable()
    // grantee_acknowledgement: Document;

    @OneToMany(
        'ProjectFundingReport',
        (projectFundingReport: ProjectFundingReport) => projectFundingReport.project_funding,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
    )
    @JoinColumn({ name: 'pk' })
    project_funding_report: ProjectFundingReport;

    @OneToMany(
        (type) => ProjectFundingLiquidation,
        (project_funding_liquidation) => project_funding_liquidation.project_funding,
        { cascade: true },
    )
    project_funding_liquidation: ProjectFundingLiquidation;

    @OneToOne((type) => ProjectCode, (project_code) => project_code.project_funding_pk, {
        eager: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'project_funding_pk' })
    @JoinTable()
    project_code: ProjectCode;
}
