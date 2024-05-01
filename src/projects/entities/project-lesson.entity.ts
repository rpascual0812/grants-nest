import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, BaseEntity, UpdateDateColumn } from 'typeorm';
import { Project } from './project.entity';
import { User } from 'src/user/entities/user.entity';

@Entity({ name: 'project_lessons' })
export class ProjectLesson extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ name: 'project_pk', nullable: false })
    project_pk: number;

    @Column({ type: 'text', nullable: false, comment: 'equivalent to challenges or lessons' })
    type: string;

    @Column({ type: 'text', nullable: false, comment: 'equivalent content for challenges or lessons' })
    type_content: string;

    @Column({
        type: 'text',
        nullable: false,
        comment: 'how it was addressed for challenges and recommendations for lessons',
    })
    description: string;

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
    @ManyToOne((type) => Project, (project) => project.project_lesson, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'project_pk' })
    project: Project;

    @ManyToOne((type) => User, (user) => user.project_lesson, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'created_by' })
    user: User;
}
