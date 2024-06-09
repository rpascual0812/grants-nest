import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    Unique,
    JoinColumn,
    ManyToOne,
    OneToOne,
    BaseEntity,
    OneToMany,
    ManyToMany,
} from 'typeorm';
import { Account } from 'src/account/entities/account.entity';
import { Gender } from 'src/gender/entities/gender.entity';
import { UserRole } from './user-role.entity';
import { Log } from 'src/log/entities/log.entity';
import { Application } from 'src/application/entities/application.entity';
import { Status } from 'src/status/entities/status.entity';
import { ApplicationRecommendation } from 'src/application/entities/application-recommendation.entity';
import { PartnerOrganizationBank } from 'src/partner/entities/partner-organization-bank.entity';
import { PartnerAssessment } from 'src/partner/entities/partner-assessment.entity';
import { Type } from 'src/type/entities/type.entity';
import { Donor } from 'src/donor/entities/donor.entity';
import { PartnerOrganizationOtherInformationFinancialHumanResources } from 'src/partner/entities/partner-organization-other-information-financial-human-resources.entity';
import { ProjectSite } from 'src/projects/entities/project-site.entity';
import { ProjectEvent } from 'src/projects/entities/project-event.entity';
import { ProjectEventAttendee } from 'src/projects/entities/project-event-attendees.entity';
import { ProjectOutput } from 'src/projects/entities/project-output.entity';
import { ProjectCapDev } from 'src/projects/entities/project-capdev.entity';
import { ProjectCapDevSkill } from 'src/projects/entities/project-capdev-skill.entity';
import { ProjectCapDevObserve } from 'src/projects/entities/project-capdev-observe.entity';
import { ProjectLesson } from 'src/projects/entities/project-lesson.entity';
import { ProjectLink } from 'src/projects/entities/project-link.entity';
import { Template } from 'src/template/entities/template.entity';
import { Document } from 'src/document/entities/document.entity';

@Entity({ name: 'users' })
@Unique(['unique_id'])
@Unique(['uuid'])
@Unique(['first_name', 'middle_name', 'last_name', 'email_address'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ name: 'account_pk', nullable: false })
    account_pk: number;

    @Column({ type: 'text', unique: true, nullable: false })
    uuid: string;

    @Column({ type: 'text', unique: true, nullable: false })
    unique_id: string;

    @Column({ type: 'text', nullable: false })
    last_name: string;

    @Column({ type: 'text', nullable: false })
    first_name: string;

    @Column({ type: 'text', nullable: true })
    middle_name: string;

    @Column({ name: 'gender_pk', nullable: true })
    gender_pk: number;

    @Column({ type: 'date' })
    birthdate: Date;

    @Column({ type: 'text', nullable: false })
    mobile_number: string;

    @Column({ type: 'text', nullable: false })
    email_address: string;

    @Column({ default: false })
    archived: boolean;

    /**
     * Relationship
     */
    @OneToOne((type) => Account, (account) => account.user, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'account_pk' })
    account: Account;

    @ManyToOne('Gender', (gender: Gender) => gender.user, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'gender_pk' })
    gender: Gender;

    @OneToMany((type) => UserRole, (user_role) => user_role.user, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'user_role_pk' })
    user_role: UserRole;

    @OneToMany('Log', (log: Log) => log.user)
    @JoinColumn({ name: 'pk' })
    log: Array<Log>;

    @OneToMany('Application', (application: Application) => application.user)
    @JoinColumn({ name: 'pk' })
    application: Array<Application>;

    @OneToMany('Status', (status: Status) => status.user)
    @JoinColumn({ name: 'pk' })
    status: Array<Status>;

    @OneToMany('ApplicationRecommendation', (recommendation: ApplicationRecommendation) => recommendation.user)
    @JoinColumn({ name: 'pk' })
    recommendation: Array<ApplicationRecommendation>;

    @OneToMany('PartnerOrganizationBank', (organization_bank: PartnerOrganizationBank) => organization_bank.user)
    @JoinColumn({ name: 'pk' })
    organization_bank: Array<PartnerOrganizationBank>;

    @OneToMany(
        'PartnerOrganizationOtherInformationFinancialHumanResources',
        (
            organization_other_information_financial_human_resources: PartnerOrganizationOtherInformationFinancialHumanResources,
        ) => organization_other_information_financial_human_resources.user,
    )
    @JoinColumn({ name: 'pk' })
    organization_other_information_financial_human_resources: Array<PartnerOrganizationOtherInformationFinancialHumanResources>;

    @OneToMany('PartnerAssessment', (partnerAssessment: PartnerAssessment) => partnerAssessment.user)
    @JoinColumn({ name: 'pk' })
    assessments: Array<PartnerAssessment>;

    @OneToMany('Type', (type: Type) => type.user)
    @JoinColumn({ name: 'pk' })
    type: Array<Type>;

    @OneToMany('Donor', (donor: Donor) => donor.user)
    @JoinColumn({ name: 'pk' })
    donor: Array<Donor>;

    @OneToMany('ProjectSite', (project_site: ProjectSite) => project_site.user)
    @JoinColumn({ name: 'pk' })
    project_site: Array<ProjectSite>;

    @OneToMany('ProjectEvent', (project_event: ProjectEvent) => project_event.user)
    @JoinColumn({ name: 'pk' })
    project_event: Array<ProjectEvent>;

    @OneToMany('ProjectEventAttendee', (project_event_attendee: ProjectEventAttendee) => project_event_attendee.user)
    @JoinColumn({ name: 'pk' })
    project_event_attendee: Array<ProjectEventAttendee>;

    @OneToMany('ProjectOutput', (project_output: ProjectOutput) => project_output.user)
    @JoinColumn({ name: 'pk' })
    project_output: Array<ProjectOutput>;

    @OneToMany('ProjectCapDev', (project_capdev: ProjectCapDev) => project_capdev.user)
    @JoinColumn({ name: 'pk' })
    project_capdev: Array<ProjectCapDev>;

    @OneToMany('ProjectCapDevSkill', (project_capdev_skill: ProjectCapDev) => project_capdev_skill.user)
    @JoinColumn({ name: 'pk' })
    project_capdev_skill: Array<ProjectCapDevSkill>;

    @OneToMany('ProjectCapDevObserve', (project_capdev_observe: ProjectCapDevObserve) => project_capdev_observe.user)
    @JoinColumn({ name: 'pk' })
    project_capdev_observe: Array<ProjectCapDevObserve>;

    @OneToMany('ProjectLesson', (project_lesson: ProjectLesson) => project_lesson.user)
    @JoinColumn({ name: 'pk' })
    project_lesson: Array<ProjectLesson>;

    @OneToMany('ProjectLink', (project_link: ProjectLink) => project_link.user)
    @JoinColumn({ name: 'pk' })
    project_link: Array<ProjectLink>;

    @OneToMany('Template', (template: Template) => template.user)
    @JoinColumn({ name: 'pk' })
    template: Array<Template>;

    @ManyToMany(() => Document, (document) => document.users, { cascade: ['insert', 'update'] })
    documents: Document[];
}
