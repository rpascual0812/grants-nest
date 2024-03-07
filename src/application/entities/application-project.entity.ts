import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToOne, ManyToOne, JoinColumn, BaseEntity, OneToMany } from 'typeorm';
import { Application } from './application.entity';
import { ApplicationProjectBeneficiary } from './application-project-beneficiary.entity';
import { ApplicationProjectLocation } from './application-project-location.entity';

@Entity({ name: 'application_projects' })
export class ApplicationProject extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ name: 'application_pk', nullable: false })
    application_pk: number;

    @Column({ type: 'text', nullable: false })
    title: string;

    @Column({ type: 'text', nullable: false })
    duration: string;

    @Column({ type: 'text', nullable: false })
    background: string;

    @Column({ type: 'text', nullable: false })
    objective: string;

    @Column({ type: 'text', nullable: false })
    expected_output: string;

    @Column({ type: 'text', nullable: false })
    how_will_affect: string;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    /**
     * Relationship
     */
    @OneToOne(type => Application, application => application.application_project, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'application_pk' })
    application: Application;

    @OneToMany('ApplicationProjectBeneficiary', (applicationProjectBeneficiary: ApplicationProjectBeneficiary) => applicationProjectBeneficiary.application_project, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'application_project_beneficiary_pk' })
    application_project_beneficiary: ApplicationProjectBeneficiary;

    @OneToMany('ApplicationProjectLocation', (applicationProjectLocation: ApplicationProjectLocation) => applicationProjectLocation.application_project, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'application_project_beneficiary_pk' })
    application_project_location: ApplicationProjectLocation;
}
