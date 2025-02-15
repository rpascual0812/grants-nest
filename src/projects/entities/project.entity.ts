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
} from 'typeorm';
import { ProjectBeneficiary } from './project-beneficiary.entity';
import { Application } from 'src/application/entities/application.entity';
import { ProjectLocation } from './project-location.entity';
import { ProjectStatus } from './project-statuses.entity';
import { Type } from 'src/type/entities/type.entity';
import { ProjectProposal } from './project-proposal.entity';
import { Partner } from 'src/partner/entities/partner.entity';
import { ProjectFunding } from './project-funding.entity';
import { Review } from 'src/review/entities/review.entity';
import { Document } from 'src/document/entities/document.entity';
import { ProjectRecommendation } from './project-recommendation.entity';
import { ProjectEvent } from './project-event.entity';
import { ProjectOutput } from './project-output.entity';
import { ProjectObjectiveResult } from './project-objective-result.entity';
import { ProjectCapDev } from './project-capdev.entity';
import { ProjectCapDevSkill } from './project-capdev-skill.entity';
import { ProjectCapDevObserve } from './project-capdev-observe.entity';
import { ProjectLesson } from './project-lesson.entity';
import { ProjectAssessment } from './project-assessment.entity';
import { ProjectCode } from './project-code.entity';

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

    @Column({ type: 'text', nullable: true })
    status: string;

    @Column({ default: false })
    financial_management_training: boolean;

    @Column({ name: 'type_pk', nullable: true })
    type_pk: number;

    @Column({ name: 'partner_pk', nullable: true })
    partner_pk: number;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    @Column({ type: 'text', nullable: true })
    overall_grant_status: string;

    @Column({ type: 'text', nullable: true })
    closing_status: string;

    @Column({ type: 'text', nullable: true })
    pending_document: string;

    @Column({ default: false })
    archived: boolean;

    /**
     * Relationship
     */
    @OneToOne((type) => Application, (application) => application.project, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'application_pk' })
    application: Application;

    @OneToMany('ProjectBeneficiary', (ProjectBeneficiary: ProjectBeneficiary) => ProjectBeneficiary.project, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'project_beneficiary_pk' })
    project_beneficiary: ProjectBeneficiary;

    @OneToMany('ProjectEvent', (project_event: ProjectEvent) => project_event.project, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'project_event_pk' })
    project_event: ProjectEvent;

    @OneToMany('ProjectCapDev', (project_capdev: ProjectCapDev) => project_capdev.project, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'project_capdev_pk' })
    project_capdev: ProjectCapDev;

    @OneToMany('ProjectCapDevSkill', (project_capdev_skill: ProjectCapDevSkill) => project_capdev_skill.project, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'project_capdev_skill_pk' })
    project_capdev_skill: ProjectCapDevSkill;

    @OneToMany(
        'ProjectCapDevObserve',
        (project_capdev_observe: ProjectCapDevObserve) => project_capdev_observe.project,
        {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
    )
    @JoinColumn({ name: 'project_capdev_observe_pk' })
    project_capdev_observe: ProjectCapDevObserve;

    @OneToMany('ProjectLesson', (project_lesson: ProjectLesson) => project_lesson.project, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'project_lesson_pk' })
    project_lesson: ProjectLesson;

    @OneToMany('ProjectOutput', (project_output: ProjectOutput) => project_output.project, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'project_output_pk' })
    project_output: ProjectOutput;

    @OneToMany('ProjectLocation', (projectLocation: ProjectLocation) => projectLocation.project, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'project_beneficiary_pk' })
    project_location: ProjectLocation;

    @ManyToOne((type) => Type, (type) => type.project, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'type_pk' })
    type: Type;

    @OneToOne((type) => ProjectProposal, (project_proposal) => project_proposal.project, { cascade: true })
    project_proposal: ProjectProposal;

    @ManyToOne((type) => Partner, (partner) => partner.projects, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'partner_pk' })
    partner: Partner;

    @OneToMany((type) => ProjectFunding, (project_funding) => project_funding.project, { cascade: true })
    project_funding: ProjectFunding;

    @ManyToMany(() => Review, (review) => review.projects, { cascade: ['insert', 'update'] })
    reviews: Review[];

    @ManyToMany(() => Document, (document) => document.projects, { cascade: ['insert', 'update'] })
    documents: Document[];

    @OneToMany('ProjectRecommendation', (projectRecommendation: ProjectRecommendation) => projectRecommendation.project)
    @JoinColumn({ name: 'pk' })
    recommendations: Array<ProjectRecommendation>;

    @OneToMany(
        'ProjectObjectiveResult',
        (project_objective_result: ProjectObjectiveResult) => project_objective_result.project,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
    )
    @JoinColumn({ name: 'project_objective_result_pk' })
    project_objective_result: ProjectObjectiveResult;

    @OneToMany((type) => ProjectAssessment, (project_assessment) => project_assessment.project, { cascade: true })
    project_assessment: ProjectAssessment;

    @OneToMany((type) => ProjectCode, (project_code) => project_code.project, { cascade: true })
    project_code: ProjectCode;
}
