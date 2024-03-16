import { Application } from 'src/application/entities/application.entity';
import { ApplicationOrganizationProfile } from 'src/application/entities/application-organization-profile.entity';
import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToOne, ManyToOne, JoinColumn, BaseEntity, OneToMany } from 'typeorm';
import { Province } from 'src/province/entities/province.entity';
import { ApplicationProjectLocation } from 'src/application/entities/application-project-location.entity';
import { PartnerOrganization } from 'src/partner/entities/partner-organization.entity';

@Entity({ name: 'countries' })
@Unique(['name', 'code'])
export class Country extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ type: 'text', nullable: false })
    code: string;

    @Column({ type: 'text', nullable: false })
    name: string;

    @Column({ type: 'int', nullable: false })
    dial_code: number;

    @Column({ type: 'text', nullable: false })
    currency_name: string;

    @Column({ type: 'text', nullable: false })
    currency_symbol: string;

    @Column({ type: 'text', nullable: false })
    currency_code: string;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    @Column({ default: false })
    active: boolean;

    @Column({ default: false })
    archived: boolean;

    /**
     * Relationship
     */
    @OneToMany('Province', (province: Province) => province.country)
    @JoinColumn({ name: 'pk' })
    province: Array<Province>;

    @OneToMany('PartnerOrganization', (partner_organization: PartnerOrganization) => partner_organization.country)
    @JoinColumn({ name: 'pk' })
    partner_organization: Array<PartnerOrganization>;

    @OneToMany('ApplicationProjectLocation', (applicationProjectLocation: ApplicationProjectLocation) => applicationProjectLocation.country)
    @JoinColumn({ name: 'pk' })
    application_project_location: Array<ApplicationProjectLocation>;
}
