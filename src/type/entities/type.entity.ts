import { ApplicationStatus } from 'src/application/entities/application-statuses.entity';
import { ProjectStatus } from 'src/projects/entities/project-statuses.entity';
import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToOne, ManyToOne, JoinColumn, BaseEntity, OneToMany } from 'typeorm';

@Entity({ name: 'types' })
@Unique(['name'])
export class Type extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ type: 'text', nullable: false })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ name: 'created_by', nullable: false })
    created_by: number;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    @Column({ default: false })
    archived: boolean;

    /**
     * Relationship
     */

    @OneToMany('Project', (project: Project) => project.type)
    @JoinColumn({ name: 'pk' })
    project: Array<Project>;
}

