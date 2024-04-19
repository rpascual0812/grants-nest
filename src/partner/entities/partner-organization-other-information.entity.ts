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
import { PartnerOrganization } from './partner-organization.entity';
import { User } from 'src/user/entities/user.entity';
import { Document } from 'src/document/entities/document.entity';
import { PartnerOrganizationOtherInformationFinancialHumanResources } from './partner-organization-other-information-financial-human-resources.entity';

@Entity({ name: 'partner_organization_other_information' })
export class PartnerOrganizationOtherInformation extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ default: false })
    has_project: boolean;

    @Column({ default: false })
    has_financial_policy: boolean;

    @Column({ type: 'text', nullable: true })
    has_financial_policy_no_reason: string;

    @Column({ default: false })
    has_financial_system: boolean;

    @Column({ type: 'text', nullable: true })
    has_financial_system_no_reason: string;

    @Column({ default: false })
    audit_financial_available: boolean;

    @Column({ default: false })
    has_reviewed_financial_system: boolean;

    @Column({ type: 'text', nullable: true })
    recommendation: string;

    @Column({ name: 'created_by', nullable: false })
    created_by: number;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    @Column({ name: 'partner_organization_pk', nullable: false })
    partner_organization_pk: number;

    @Column({ default: false })
    archived: boolean;

    /**
     * Relationship
     */
    @ManyToOne(
        (type) => PartnerOrganization,
        (partner_organization) => partner_organization.partner_organization_other_information,
        { onDelete: 'CASCADE' },
    )
    @JoinColumn({ name: 'partner_organization_pk' })
    partner_organization: PartnerOrganization;

    @ManyToOne((type) => User, (user) => user.organization_bank, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'created_by' })
    user: User;

    @ManyToMany(() => Document, (document) => document.partner_organization_other_infos, { cascade: ['insert', 'update'] })
    documents: Document[];

    @OneToMany('PartnerOrganizationOtherInformationFinancialHumanResources', (organization_other_information_financial_human_resources: PartnerOrganizationOtherInformationFinancialHumanResources) => organization_other_information_financial_human_resources.partner_organization_other_information)
    @JoinColumn({ name: 'pk' })
    organization_other_information_financial_human_resources: Array<PartnerOrganizationOtherInformationFinancialHumanResources>;
}
