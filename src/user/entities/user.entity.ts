import { Entity, Column, PrimaryGeneratedColumn, Unique, JoinColumn, ManyToOne, OneToOne, BaseEntity, OneToMany, ManyToMany } from 'typeorm';
import { Account } from 'src/account/entities/account.entity';
import { Gender } from 'src/gender/entities/gender.entity';
import { UserRole } from './user-role.entity';
import { Log } from 'src/log/entities/log.entity';
import { Application } from 'src/application/entities/application.entity';
import { Status } from 'src/status/entities/status.entity';
import { ApplicationRecommendation } from 'src/application/entities/application-recommendation.entity';
import { PartnerOrganizationBank } from 'src/partner/entities/partner-organization-bank.entity';
import { PartnerAssessment } from 'src/partner/entities/partner-assessment.entity';

@Entity({ name: 'users' })
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
    @OneToOne(type => Account, account => account.user, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'account_pk' })
    account: Account;

    @ManyToOne('Gender', (gender: Gender) => gender.user, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'gender_pk' })
    gender: Gender;

    @OneToMany(type => UserRole, user_role => user_role.user, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
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

    @OneToMany('PartnerAssessment', (partnerAssessment: PartnerAssessment) => partnerAssessment.user)
    @JoinColumn({ name: 'pk' })
    assessments: Array<PartnerAssessment>;
}
