import { Country } from 'src/country/entities/country.entity';
import { Organization } from 'src/organization/entities/organization.entity';
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
import { Application } from './application.entity';

@Entity({ name: 'application_organization_profile' })
export class ApplicationOrganizationProfile extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ name: 'application_pk', nullable: false })
    application_pk: number;

    @Column({ name: 'organization_pk', nullable: true })
    organization_pk: number;

    @Column({ type: 'text', nullable: false })
    tribe: string;

    @Column({ default: false })
    womens_organization: boolean;

    @Column({ default: false })
    youth_organization: boolean;

    @Column({ default: false })
    differently_abled_organization: boolean;

    @Column({ type: 'text', nullable: true })
    other_sectoral_group: string;

    @Column({ default: false })
    farmers_group: boolean;

    @Column({ default: false })
    fisherfolks: boolean;

    @Column({ type: 'text', nullable: false })
    mission: string;

    @Column({ type: 'text', nullable: false })
    vision: string;

    @Column({ type: 'text', nullable: false })
    description: string;

    @Column({ name: 'country_pk', nullable: true })
    country_pk: number;

    @Column({ type: 'text', nullable: false })
    project_website: string;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    /**
     * Relationship
     */
    @ManyToOne('Organization', (organization: Organization) => organization.application_organization_profile, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'organization_pk' })
    organization: Organization;

    @ManyToOne('Country', (country: Country) => country.application_organization_profile, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'country_pk' })
    country: Country;

    @OneToOne((type) => Application, (application) => application.application_organization_profile, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'application_pk' })
    application: Application;
}
