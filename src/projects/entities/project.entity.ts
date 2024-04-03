import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToOne, ManyToOne, JoinColumn, BaseEntity, OneToMany } from 'typeorm';
import { ProjectBeneficiary } from './project-beneficiary.entity';
import { Application } from 'src/application/entities/application.entity';
import { ProjectLocation } from './project-location.entity';
import { ProjectStatus } from './project-statuses.entity';
import { Type } from 'src/type/entities/type.entity';
import { ProjectProposal } from './project-proposal.entity';
import { Partner } from 'src/partner/entities/partner.entity';

@Entity({ name: 'projects' })
export class Project extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ name: 'application_pk', nullable: false })
    application_pk: number;

    @Column({ type: 'text', nullable: false })
    title: string;

    @Column({ type: 'text', nullable: false })
    duration: string;

    @Column({ type: 'text', nullable: false })
    background: string;

    @Column({ type: 'text', nullable: false })
    objective: string;

    @Column({ type: 'text', nullable: false })
    expected_output: string;

    @Column({ type: 'text', nullable: false })
    how_will_affect: string;

    @Column({ name: 'status_pk', nullable: true })
    status_pk: number;

    @Column({ name: 'type_pk', nullable: true })
    type_pk: number;

    @Column({ name: 'partner_pk', nullable: true })
    partner_pk: number;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    /**
     * Relationship
     */
    @OneToOne(type => Application, application => application.project, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'application_pk' })
    application: Application;

    @OneToMany('ProjectBeneficiary', (ProjectBeneficiary: ProjectBeneficiary) => ProjectBeneficiary.project, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'application_project_beneficiary_pk' })
    project_beneficiary: ProjectBeneficiary;

    @OneToMany('ProjectLocation', (projectLocation: ProjectLocation) => projectLocation.project, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'project_beneficiary_pk' })
    project_location: ProjectLocation;

    @OneToMany('ProjectStatus', (project_statuses: ProjectStatus) => project_statuses.project)
    @JoinColumn({ name: 'status_pk' })
    project_statuses: Array<ProjectStatus>;

    @ManyToOne(type => Type, type => type.project, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'type_pk' })
    type: Type;

    @OneToOne((type) => ProjectProposal, (project_proposal) => project_proposal.project, { cascade: true })
    project_proposal: ProjectProposal;

    @ManyToOne((type) => Partner, (partner) => partner.projects, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'partner_pk' })
    partner: Partner;
}
