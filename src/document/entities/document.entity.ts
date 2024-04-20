import { Entity, Column, PrimaryGeneratedColumn, Unique, JoinColumn, ManyToOne, OneToMany, ManyToMany, OneToOne, JoinTable } from 'typeorm';
import { Application } from 'src/application/entities/application.entity';
import { Review } from 'src/review/entities/review.entity';
import { Partner } from 'src/partner/entities/partner.entity';
import { PartnerFiscalSponsor } from 'src/partner/entities/partner-fiscal-sponsor.entity';
import { PartnerOrganizationOtherInformation } from 'src/partner/entities/partner-organization-other-information.entity';
import { PartnerNonprofitEquivalencyDetermination } from 'src/partner/entities/partner-nonprofit-equivalency-determination.entity';
import { ProjectFunding } from 'src/projects/entities/project-funding.entity';
import { ProjectFundingLiquidation } from 'src/projects/entities/project-funding-liquidation.entity';

@Entity({ name: 'documents' })
@Unique(['filename'])
export class Document {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ type: 'text', nullable: true })
    type: string;

    @Column({ type: 'text', nullable: false })
    original_name: string;

    @Column({ type: 'text', nullable: false })
    filename: string;

    @Column({ type: 'text', nullable: false })
    path: string;

    @Column({ type: 'text', nullable: false })
    mime_type: string;

    @Column({ type: 'numeric' })
    size: number;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    @Column({ default: false })
    archived: boolean;

    /**
     * Relationship
     */
    @ManyToMany(() => Application, application => application.documents)
    @JoinTable({
        name: 'document_application_relation',
        joinColumn: {
            name: 'document_pk',
            referencedColumnName: 'pk',
        },
        inverseJoinColumn: {
            name: 'application_pk',
            referencedColumnName: 'pk',
        }
    })
    applications: Application[];

    @ManyToMany(() => Review, review => review.documents)
    @JoinTable({
        name: 'document_review_relation',
        joinColumn: {
            name: 'document_pk',
            referencedColumnName: 'pk',
        },
        inverseJoinColumn: {
            name: 'review_pk',
            referencedColumnName: 'pk',
        }
    })
    reviews: Review[];

    @ManyToMany(() => Partner, partner => partner.documents)
    @JoinTable({
        name: 'document_partner_relation',
        joinColumn: {
            name: 'document_pk',
            referencedColumnName: 'pk',
        },
        inverseJoinColumn: {
            name: 'partner_pk',
            referencedColumnName: 'pk',
        }
    })
    partners: Partner[];

    @ManyToMany(() => PartnerFiscalSponsor, partner_fiscal_sponsor => partner_fiscal_sponsor.documents)
    @JoinTable({
        name: 'document_partner_fiscal_sponsor_relation',
        joinColumn: {
            name: 'document_pk',
            referencedColumnName: 'pk',
        },
        inverseJoinColumn: {
            name: 'partner_fiscal_sponsor_pk',
            referencedColumnName: 'pk',
        }
    })
    partner_fiscal_sponsors: PartnerFiscalSponsor[];

    @ManyToMany(() => PartnerOrganizationOtherInformation, partner_organization_other_info => partner_organization_other_info.documents)
    @JoinTable({
        name: 'document_partner_organization_other_info_relation',
        joinColumn: {
            name: 'document_pk',
            referencedColumnName: 'pk',
        },
        inverseJoinColumn: {
            name: 'partner_organization_other_info_pk',
            referencedColumnName: 'pk',
        }
    })
    partner_organization_other_infos: PartnerOrganizationOtherInformation[];

    @ManyToMany(() => PartnerNonprofitEquivalencyDetermination, partner_nonprofit_equivalency_determination => partner_nonprofit_equivalency_determination.documents)
    @JoinTable({
        name: 'document_partner_nonprofit_equivalency_determination_relation',
        joinColumn: {
            name: 'document_pk',
            referencedColumnName: 'pk',
        },
        inverseJoinColumn: {
            name: 'partner_nonprofit_equivalency_determination_pk',
            referencedColumnName: 'pk',
        }
    })
    partner_nonprofit_equivalency_determinations: PartnerNonprofitEquivalencyDetermination[];

    @OneToOne(type => ProjectFunding, funding => funding.bank_receipt_document, { cascade: true })
    bank_receipt: ProjectFunding;

    @OneToOne(type => ProjectFunding, funding => funding.grantee_acknowledgement, { cascade: true })
    grantee_acknowledgement: ProjectFunding;

    @ManyToMany(() => ProjectFundingLiquidation, project_funding_liquidation => project_funding_liquidation.documents)
    @JoinTable({
        name: 'project_document_funding_liquidation_relation',
        joinColumn: {
            name: 'document_pk',
            referencedColumnName: 'pk',
        },
        inverseJoinColumn: {
            name: 'project_funding_liquidation_pk',
            referencedColumnName: 'pk',
        }
    })
    project_funding_liquidations: ProjectFundingLiquidation[];
}
