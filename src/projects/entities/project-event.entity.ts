import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToOne, ManyToOne, JoinColumn, BaseEntity, OneToMany } from 'typeorm';
import { Project } from './project.entity';
import { User } from 'src/user/entities/user.entity';
import { ProjectEventAttendee } from './project-event-attendees.entity';

@Entity({ name: 'project_events' })
@Unique(['project_pk', 'name'])
export class ProjectEvent extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ name: 'project_pk', nullable: false })
    project_pk: number;

    @Column({ type: 'text', nullable: false })
    name: string;

    @Column({ name: 'created_by', nullable: false })
    created_by: number;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    @Column({ default: false })
    archived: boolean;

    /**
     * Relationship
     */
    @ManyToOne(type => Project, project => project.project_event, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'project_pk' })
    project: Project;

    @ManyToOne((type) => User, (user) => user.project_event, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'created_by' })
    user: User;

    @OneToMany('ProjectEventAttendee', (project_event_attendee: ProjectEventAttendee) => project_event_attendee.project_event, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'project_event_attendee_pk' })
    project_event_attendee: ProjectEventAttendee;
}
