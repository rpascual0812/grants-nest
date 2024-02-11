import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToOne, ManyToOne, JoinColumn, BaseEntity, OneToMany } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { ApplicationProponent } from './application-proponent.entity';
import { ApplicationOrganizationProfile } from './application-organization-profile.entity';
import { ApplicationProject } from './application-project.entity';

@Entity({ name: 'applications' })
export class Application extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ type: 'text', nullable: false })
    uuid: string;

    @Column({ name: 'created_by', nullable: false })
    created_by: number;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    /**
     * Relationship
     */

    @ManyToOne(type => User, user => user.application, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'created_by' })
    user: User;

    @OneToOne(type => ApplicationProponent, application_proponent => application_proponent.application, { cascade: true })
    application_proponent: ApplicationProponent;

    @OneToOne(type => ApplicationOrganizationProfile, application_organization_profile => application_organization_profile.application, { cascade: true })
    application_organization_profile: ApplicationOrganizationProfile;

    @OneToOne(type => ApplicationProject, application_project => application_project.application, { cascade: true })
    application_project: ApplicationProject;
}
