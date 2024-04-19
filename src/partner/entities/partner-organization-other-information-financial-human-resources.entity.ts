import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToOne, ManyToOne, JoinColumn, BaseEntity, OneToMany } from 'typeorm';
import { PartnerOrganization } from './partner-organization.entity';
import { User } from 'src/user/entities/user.entity';
import { PartnerOrganizationOtherInformation } from './partner-organization-other-information.entity';

@Entity({ name: 'partner_organization_other_information_financial_human_resource' })
export class PartnerOrganizationOtherInformationFinancialHumanResources extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ name: 'partner_organization_other_information_pk', nullable: false })
    partner_organization_other_information_pk: number;

    @Column({ type: 'text', nullable: false })
    name: string;

    @Column({ type: 'text', nullable: false })
    designation: string;

    @Column({ name: 'created_by', nullable: false })
    created_by: number;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    @Column({ default: false })
    archived: boolean;

    /**
     * Relationship
     */
    @ManyToOne(type => PartnerOrganizationOtherInformation, partner_organization_other_information => partner_organization_other_information.organization_other_information_financial_human_resources, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'partner_organization_other_information_pk' })
    partner_organization_other_information: PartnerOrganizationOtherInformation;

    @ManyToOne((type) => User, (user) => user.organization_other_information_financial_human_resources, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'created_by' })
    user: User;
}
