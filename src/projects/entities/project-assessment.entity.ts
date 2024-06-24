import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToOne, ManyToOne, JoinColumn, BaseEntity, UpdateDateColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Project } from './project.entity';
import { Donor } from 'src/donor/entities/donor.entity';

@Entity({ name: 'project_assessments' })
export class ProjectAssessment {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ name: 'project_pk', nullable: false })
    project_pk: number;

    @Column({ name: 'donor_pk', nullable: true })
    donor_pk: number; // not being used right now. according to hermie, donors are entered in the tranche. keeping it here just in case they changed their minds

    @Column({ name: 'thematic_area_pk', nullable: true })
    thematic_area_pk: number;

    @Column({ type: 'text', nullable: false })
    message: string;

    @Column({ name: 'created_by', nullable: false })
    created_by: number;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    @UpdateDateColumn()
    date_updated: Date;

    @Column({ default: false })
    archived: boolean;

    /**
     * Relationship
     */

    @ManyToOne(type => Project, project => project.project_assessment, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'project_pk' })
    project: Project;

    @ManyToOne((type) => User, (user) => user.project_assessment, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'created_by' })
    user: User;

    @ManyToOne((type) => Donor, (donor) => donor.project_assessment, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'donor_pk' })
    donor: Donor;
}
