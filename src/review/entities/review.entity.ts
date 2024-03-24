import { ApplicationStatus } from 'src/application/entities/application-statuses.entity';
import { ProjectStatus } from 'src/projects/entities/project-statuses.entity';
import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToOne, ManyToOne, JoinColumn, BaseEntity, OneToMany } from 'typeorm';
import { Reviewable } from './reviewable.entity';

@Entity({ name: 'reviews' })
export class Review extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ type: 'text', nullable: false })
    message: string;

    @Column({ type: 'text', nullable: true })
    flag: string;

    @Column({ name: 'created_by', nullable: false })
    created_by: number;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    @Column({ default: false })
    archived: boolean;

    /**
     * Relationship
     */

    @ManyToOne(type => User, user => user.application, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'created_by' })
    user: User;

    @OneToMany('Reviewable', (reviewable: Reviewable) => reviewable.review, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'pk' })
    reviewable: Reviewable;
}


