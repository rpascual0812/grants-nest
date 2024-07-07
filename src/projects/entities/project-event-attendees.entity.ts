import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToOne, ManyToOne, JoinColumn, BaseEntity, OneToMany } from 'typeorm';
import { Project } from './project.entity';
import { User } from 'src/user/entities/user.entity';
import { ProjectEvent } from './project-event.entity';

@Entity({ name: 'project_event_attendees' })
@Unique(['project_event_pk', 'name', 'birthday'])
export class ProjectEventAttendee extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ name: 'project_event_pk', nullable: false })
    project_event_pk: number;

    @Column({ type: 'text', nullable: false })
    name: string;

    @Column({ type: 'timestamptz', nullable: true })
    birthday: Date;

    @Column({ type: 'text', nullable: false })
    address: string;

    @Column({ type: 'text', nullable: false })
    mobile_number: string;

    @Column({ name: 'created_by', nullable: true })
    created_by: number;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    @Column({ default: false })
    archived: boolean;

    /**
     * Relationship
     */
    @ManyToOne(type => ProjectEvent, project_event => project_event.project_event_attendee, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'project_event_pk' })
    project_event: ProjectEvent;

    @ManyToOne((type) => User, (user) => user.project_event_attendee, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'created_by' })
    user: User;
}
