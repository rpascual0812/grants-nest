import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToOne, ManyToOne, JoinColumn, BaseEntity, OneToMany } from 'typeorm';
import { Status } from 'src/status/entities/status.entity';
import { Project } from './project.entity';

@Entity({ name: 'project_statuses' })
@Unique(['project_pk', 'status_pk'])
export class ProjectStatus extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ name: 'project_pk', nullable: false })
    project_pk: number;

    @Column({ name: 'status_pk', nullable: false })
    status_pk: number;

    @Column({ default: false })
    archived: boolean;

    /**
     * Relationship
     */

    // @ManyToOne(type => Project, project => project.project_statuses, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    // @JoinColumn({ name: 'project_pk' })
    // project: Project;

    @ManyToOne(type => Status, status => status.project_status, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'status_pk' })
    status: Status;
}
