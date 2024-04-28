import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToOne, ManyToOne, JoinColumn, BaseEntity, OneToMany } from 'typeorm';
import { Project } from './project.entity';
import { User } from 'src/user/entities/user.entity';
import { ProjectObjectiveResult } from './project-objective-result.entity';

@Entity({ name: 'project_outputs' })
@Unique(['project_pk'])
export class ProjectOutput extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ name: 'project_pk', nullable: false })
    project_pk: number;

    @Column({ default: false })
    tenure_security: boolean;

    @Column({ type: 'text', nullable: true })
    tenure_security_form: string;

    @Column({ type: 'text', nullable: true })
    territory: string;

    @Column({ name: 'hectares', nullable: true })
    hectares: number;

    @Column({ type: 'text', nullable: false })
    livelihood: string;

    @Column({ type: 'text', nullable: false })
    individual_income: string;

    @Column({ type: 'text', nullable: false })
    household_income: string;

    @Column({ name: 'individual', nullable: true })
    individual: number;

    @Column({ name: 'household', nullable: true })
    household: number;

    @Column({ default: false })
    disability_rights: boolean;

    @Column({ type: 'text', nullable: true })
    intervention_type: string;

    @Column({ name: 'created_by', nullable: false })
    created_by: number;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    @Column({ default: false })
    archived: boolean;

    /**
     * Relationship
     */
    @ManyToOne(type => Project, project => project.project_output, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'project_pk' })
    project: Project;

    @ManyToOne((type) => User, (user) => user.project_output, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'created_by' })
    user: User;
}
