import { Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { Project } from './project.entity';
import { User } from 'src/user/entities/user.entity';
import { ProjectFunding } from './project-funding.entity';

@Entity({ name: 'project_codes' })
export class ProjectCode extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ name: 'project_pk', nullable: false })
    project_pk: number;

    @Column({ name: 'project_funding_pk', nullable: false })
    project_funding_pk: number;

    @Column({ type: 'text', nullable: false })
    code: string;

    @Column({ name: 'created_by', nullable: false })
    created_by: number;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    /**
     * Relationship
     */
    @ManyToOne((type) => Project, (project) => project.project_code, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'project_pk' })
    project: Project;

    @ManyToOne((type) => User, (user) => user.project_code, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'created_by' })
    user: User;

    @OneToOne((type) => ProjectFunding, (project_funding) => project_funding.project_code, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'project_funding_pk' })
    project_funding: ProjectFunding;
}
