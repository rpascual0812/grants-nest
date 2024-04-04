import { Application } from 'src/application/entities/application.entity';
import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToOne, ManyToOne, JoinColumn, BaseEntity, OneToMany, ManyToMany } from 'typeorm';
import { PartnerContact } from './partner-contacts.entity';
import { PartnerOrganization } from './partner-organization.entity';
import { PartnerFiscalSponsor } from './partner-fiscal-sponsor.entity';
import { PartnerNonprofitEquivalencyDetermination } from './partner-nonprofit-equivalency-determination.entity';
import { Project } from 'src/projects/entities/project.entity';
import { Document } from 'src/document/entities/document.entity';
import { PartnerAssessment } from './partner-assessment.entity';

@Entity({ name: 'partners' })
@Unique(['partner_id'])
export class Partner extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ type: 'text', nullable: false })
    partner_id: string;

    @Column({ type: 'text', nullable: false })
    name: string;

    @Column({ type: 'text', nullable: true })
    address: string;

    @Column({ type: 'text', nullable: true })
    contact_number: string;

    @Column({ type: 'text', nullable: false })
    email_address: string;

    @Column({ type: 'text', nullable: true })
    website: string;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    @Column({ default: false })
    archived: boolean;

    /**
     * Relationship
     */
    @OneToMany('Application', (application: Application) => application.partner)
    @JoinColumn({ name: 'pk' })
    applications: Array<Application>;

    @OneToMany('Project', (project: Project) => project.partner)
    @JoinColumn({ name: 'pk' })
    projects: Array<Project>;

    @OneToMany('PartnerContact', (partner_contact: PartnerContact) => partner_contact.partner, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'pk' })
    contacts: PartnerContact;

    @OneToMany('PartnerAssessment', (partner_assessment: PartnerAssessment) => partner_assessment.partner, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'pk' })
    assessments: PartnerAssessment;

    @OneToOne(type => PartnerOrganization, partner_organization => partner_organization.partner, { cascade: true })
    partner_organization: PartnerOrganization;

    @OneToOne(
        (type) => PartnerFiscalSponsor,
        (partner_fiscal_sponsor) => partner_fiscal_sponsor.partner,
        { cascade: true },
    )
    partner_fiscal_sponsor: PartnerFiscalSponsor;

    @OneToOne(
        (type) => PartnerNonprofitEquivalencyDetermination,
        (partner_nonprofit_equivalency_determination) =>
            partner_nonprofit_equivalency_determination.partner,
        { cascade: true },
    )
    partner_nonprofit_equivalency_determination: PartnerNonprofitEquivalencyDetermination;

    @ManyToMany(() => Document, (document) => document.partners, { cascade: ['insert', 'update'] })
    documents: Document[];
}
