import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToOne, ManyToOne, JoinColumn, BaseEntity, OneToMany } from 'typeorm';
import { PartnerOrganization } from './partner-organization.entity';
import { User } from 'src/user/entities/user.entity';

@Entity({ name: 'partner_organization_banks' })
export class PartnerOrganizationBank extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ name: 'partner_organization_pk', nullable: false })
    partner_organization_pk: number;

    @Column({ type: 'text', nullable: false })
    account_name: string;

    @Column({ type: 'text', nullable: false })
    account_number: string;

    @Column({ type: 'text', nullable: false })
    bank_name: string;

    @Column({ type: 'text', nullable: false })
    bank_branch: string;

    @Column({ type: 'text', nullable: false })
    swift_code: string;

    @Column({ name: 'created_by', nullable: false })
    created_by: number;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    @Column({ default: false })
    archived: boolean;

    /**
     * Relationship
     */
    @ManyToOne(type => PartnerOrganization, partner_organization => partner_organization.partner_organization_bank, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'partner_organization_pk' })
    partner_organization: PartnerOrganization;

    @ManyToOne((type) => User, (user) => user.organization_bank, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'created_by' })
    user: User;
}
