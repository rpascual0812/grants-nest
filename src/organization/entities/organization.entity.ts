import { Application } from 'src/application/entities/application.entity';
import { ApplicationOrganizationProfile } from 'src/application/entities/application-organization-profile.entity';
import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToOne, ManyToOne, JoinColumn, BaseEntity, OneToMany } from 'typeorm';

@Entity({ name: 'organizations' })
export class Organization extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ type: 'text', nullable: false })
    name: string;

    @Column({ default: false })
    archived: boolean;

    /**
     * Relationship
     */
    @OneToMany('ApplicationOrganizationProfile', (application_organization_profile: ApplicationOrganizationProfile) => application_organization_profile.organization)
    @JoinColumn({ name: 'pk' })
    application_organization_profile: Array<ApplicationOrganizationProfile>;
}
