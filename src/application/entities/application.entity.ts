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
import { User } from 'src/user/entities/user.entity';
import { ApplicationOrganizationProfile } from './application-organization-profile.entity';
import { Partner } from 'src/partner/entities/partner.entity';
import { ApplicationProposal } from './application-proposal.entity';
import { ApplicationNonprofitEquivalencyDetermination } from './application-nonprofit-equivalency-determination.entity';
import { ApplicationFiscalSponsor } from './application-fiscal-sponsor.entity';
import { ApplicationReference } from './application-references.entity';
import { ApplicationStatus } from './application-statuses.entity';
import { Project } from 'src/projects/entities/project.entity';
import { Review } from 'src/review/entities/review.entity';
import { Type } from 'src/type/entities/type.entity';

@Entity({ name: 'applications' })
@Unique(['uuid'])
@Unique(['number'])
export class Application extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ type: 'text', nullable: false })
    uuid: string;

    @Column({ name: 'number', nullable: false })
    number: string;

    @Column({ name: 'partner_pk', nullable: false })
    partner_pk: number;

    @Column({ name: 'created_by', nullable: false })
    created_by: number;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    @Column({ default: false })
    archived: boolean;

    /**
     * Relationship
     */

    @ManyToOne((type) => User, (user) => user.application, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'created_by' })
    user: User;

    @ManyToOne((type) => Partner, (partner) => partner.application, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'partner_pk' })
    partner: Partner;

    @OneToOne(
        (type) => ApplicationOrganizationProfile,
        (application_organization_profile) => application_organization_profile.application,
        { cascade: true },
    )
    application_organization_profile: ApplicationOrganizationProfile;

    @OneToOne((type) => Project, (project) => project.application, { cascade: true })
    project: Project;

    @OneToOne((type) => ApplicationProposal, (application_proposal) => application_proposal.application, {
        cascade: true,
    })
    application_proposal: ApplicationProposal;

    @OneToOne(
        (type) => ApplicationNonprofitEquivalencyDetermination,
        (application_nonprofit_equivalency_determination) =>
            application_nonprofit_equivalency_determination.application,
        { cascade: true },
    )
    application_nonprofit_equivalency_determination: ApplicationNonprofitEquivalencyDetermination;

    @OneToOne(
        (type) => ApplicationFiscalSponsor,
        (application_fiscal_sponsor) => application_fiscal_sponsor.application,
        { cascade: true },
    )
    application_fiscal_sponsor: ApplicationFiscalSponsor;

    @OneToMany('ApplicationReference', (ApplicationReference: ApplicationReference) => ApplicationReference.application)
    @JoinColumn({ name: 'pk' })
    application_reference: Array<ApplicationReference>;

    // @ManyToOne(type => ApplicationStatus, application_status => application_status.application, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    // @JoinColumn({ name: 'application_status_pk' })
    // application_status: ApplicationStatus;

    @OneToMany('ApplicationStatus', (application_statuses: ApplicationStatus) => application_statuses.application)
    @JoinColumn({ name: 'pk' })
    application_statuses: Array<ApplicationStatus>;

    @ManyToMany(() => Review, (review) => review.applications, { cascade: ['insert', 'update'] })
    reviews: Review[];

    @ManyToMany(() => Type, (type) => type.applications, { cascade: ['insert', 'update'] })
    types: Type[];
}
