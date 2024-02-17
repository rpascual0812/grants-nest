import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToOne, ManyToOne, JoinColumn, BaseEntity, OneToMany } from 'typeorm';
import { ApplicationProject } from './application-project.entity';
import { Province } from 'src/province/entities/province.entity';
import { Country } from 'src/country/entities/country.entity';

@Entity({ name: 'application_project_locations' })
export class ApplicationProjectLocation extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ name: 'application_project_pk', nullable: false })
    application_project_pk: number;

    @Column({ name: 'country_pk', nullable: false })
    country_pk: number;

    @Column({ name: 'province_code', nullable: false })
    province_code: number;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    /**
     * Relationship
     */
    @ManyToOne(type => ApplicationProject, applicationProject => applicationProject.application_project_location, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'application_project_pk' })
    application_project: ApplicationProject;

    @ManyToOne(type => Country, country => country.application_project_location, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'country_pk' })
    country: Country;

    @ManyToOne(type => Province, province => province.application_project_location, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'province_code' })
    province: Province;
}
