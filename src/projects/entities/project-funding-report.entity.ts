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
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { ProjectFunding } from './project-funding.entity';
import { Document } from 'src/document/entities/document.entity';

@Entity({ name: 'project_funding_reports' })
export class ProjectFundingReport extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ name: 'project_funding_pk', nullable: false })
    project_funding_pk: number;

    @Column({ type: 'text', nullable: false })
    title: string;

    @Column({ type: 'text', nullable: false })
    status: string;

    @Column({ name: 'attachment_pk', nullable: true })
    attachment_pk: number;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    @Column({ default: false })
    archived: boolean;

    /**
     * Relationship
     */
    @ManyToOne((type) => ProjectFunding, (project_funding) => project_funding.project_funding_report, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'project_funding_pk' })
    project_funding: ProjectFunding;

    @OneToOne((type) => Document, (document) => document.funding_report_attachment, {
        eager: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'attachment_pk' })
    @JoinTable()
    document: Document;

    // @ManyToMany(() => Document, (document) => document.project_funding_reports, { cascade: ['insert', 'update'] })
    // documents: Document[];
}
