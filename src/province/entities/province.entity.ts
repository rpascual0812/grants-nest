import { ApplicationProjectLocation } from 'src/application/entities/application-project-location.entity';
import { Country } from 'src/country/entities/country.entity';
import { Entity, Column, PrimaryGeneratedColumn, Unique, JoinColumn, ManyToOne, OneToOne, BaseEntity, AfterLoad, OneToMany, ManyToMany, PrimaryColumn } from 'typeorm';

@Entity({ name: 'provinces' })
@Unique(['name', 'province_code'])
export class Province {
    @Column({ type: 'bigint', nullable: true })
    psgc_code: number;

    @Column({ type: 'int', nullable: true })
    region_code: number;

    @PrimaryColumn()
    province_code: number;

    @Column({ type: 'text', nullable: false })
    name: string;

    @Column({ name: 'country_pk', nullable: false })
    country_pk: number;

    @Column({ default: false })
    active: boolean;

    @Column({ name: 'user_pk', nullable: false })
    user_pk: number;

    @Column({ default: false })
    archived: boolean;

    /**
     * Relationship
     */
    @ManyToOne(type => Country, country => country.province, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'country_pk' })
    country: Country;

    @OneToMany('ApplicationProjectLocation', (applicationProjectLocation: ApplicationProjectLocation) => applicationProjectLocation.province)
    @JoinColumn({ name: 'pk' })
    application_project_location: Array<ApplicationProjectLocation>;
}
