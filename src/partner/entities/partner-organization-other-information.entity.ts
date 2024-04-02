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
} from 'typeorm';
import { PartnerOrganization } from './partner-organization.entity';
import { User } from 'src/user/entities/user.entity';

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
}
