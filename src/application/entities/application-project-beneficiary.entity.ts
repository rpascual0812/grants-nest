import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToOne, ManyToOne, JoinColumn, BaseEntity, OneToMany } from 'typeorm';
import { ApplicationProject } from './application-project.entity';

@Entity({ name: 'application_project_beneficiaries' })
export class ApplicationProjectBeneficiary extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ name: 'application_project_pk', nullable: false })
    application_project_pk: number;

    @Column({ type: 'text', nullable: false })
    type: string;

    @Column({ type: 'text', nullable: false })
    diffable: string;

    @Column({ type: 'text', nullable: false })
    other: string;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    /**
     * Relationship
     */
    @ManyToOne(type => ApplicationProject, applicationProject => applicationProject.application_project_beneficiary, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'application_project_pk' })
    application_project: ApplicationProject;
}
