import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToOne, ManyToOne, JoinColumn, BaseEntity, OneToMany } from 'typeorm';
import { Project } from './project.entity';
import { Province } from 'src/province/entities/province.entity';
import { Country } from 'src/country/entities/country.entity';

@Entity({ name: 'project_locations' })
export class ProjectLocation extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ name: 'project_pk', nullable: false })
    project_pk: number;

    @Column({ name: 'country_pk', nullable: false })
    country_pk: number;

    @Column({ name: 'province_code', nullable: false })
    province_code: number;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    /**
     * Relationship
     */
    @ManyToOne(type => Project, project => project.project_location, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'project_pk' })
    project: Project;

    @ManyToOne(type => Country, country => country.project_location, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'country_pk' })
    country: Country;

    @ManyToOne(type => Province, province => province.project_location, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'province_code' })
    province: Province;
}
