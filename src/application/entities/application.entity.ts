import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToOne, ManyToOne, JoinColumn, BaseEntity, OneToMany } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { ApplicationProponent } from './application-proponent.entity';
import { ApplicationOrganizationProfile } from './application-organization-profile.entity';
import { ApplicationProject } from './application-project.entity';
import { Partner } from 'src/partner/entities/partner.entity';
import { ApplicationProposal } from './application-proposal.entity';
import { ApplicationDocument } from './application-document.entity';
import { ApplicationNonprofitEquivalencyDetermination } from './application-nonprofit-equivalency-determination.entity';
import { ApplicationFiscalSponsor } from './application-fiscal-sponsor.entity';
import { ApplicationReference } from './application-references.entity';
import { ApplicationStatus } from './application-statuses.entity';

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

    @Column({ name: 'status_pk', nullable: true })
    status_pk: number;

    @Column({ default: false })
    archived: boolean;

    /**
     * Relationship
     */

    @ManyToOne(type => User, user => user.application, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'created_by' })
    user: User;

    @ManyToOne(type => Partner, partner => partner.application, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'partner_pk' })
    partner: Partner;

    // @OneToOne(type => ApplicationProponent, application_proponent => application_proponent.application, { cascade: true })
    // application_proponent: ApplicationProponent;

    @OneToOne(type => ApplicationOrganizationProfile, application_organization_profile => application_organization_profile.application, { cascade: true })
    application_organization_profile: ApplicationOrganizationProfile;

    @OneToOne(type => ApplicationProject, application_project => application_project.application, { cascade: true })
    application_project: ApplicationProject;

    @OneToOne(type => ApplicationProposal, application_proposal => application_proposal.application, { cascade: true })
    application_proposal: ApplicationProposal;

    @OneToOne(type => ApplicationNonprofitEquivalencyDetermination, application_nonprofit_equivalency_determination => application_nonprofit_equivalency_determination.application, { cascade: true })
    application_nonprofit_equivalency_determination: ApplicationNonprofitEquivalencyDetermination;

    @OneToOne(type => ApplicationFiscalSponsor, application_fiscal_sponsor => application_fiscal_sponsor.application, { cascade: true })
    application_fiscal_sponsor: ApplicationFiscalSponsor;

    @OneToMany('ApplicationDocument', (applicationDocument: ApplicationDocument) => applicationDocument.application)
    @JoinColumn({ name: 'pk' })
    application_document: Array<ApplicationDocument>;

    @OneToMany('ApplicationReference', (ApplicationReference: ApplicationReference) => ApplicationReference.application)
    @JoinColumn({ name: 'pk' })
    application_reference: Array<ApplicationReference>;

    // @ManyToOne(type => ApplicationStatus, application_status => application_status.application, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    // @JoinColumn({ name: 'application_status_pk' })
    // application_status: ApplicationStatus;

    @OneToMany('ApplicationStatus', (application_statuses: ApplicationStatus) => application_statuses.application)
    @JoinColumn({ name: 'pk' })
    application_statuses: Array<ApplicationStatus>;
}
