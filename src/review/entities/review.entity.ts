import { ApplicationStatus } from 'src/application/entities/application-statuses.entity';
import { ProjectStatus } from 'src/projects/entities/project-statuses.entity';
import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToOne, ManyToOne, JoinColumn, BaseEntity, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Application } from 'src/application/entities/application.entity';
import { Document } from 'src/document/entities/document.entity';

@Entity({ name: 'reviews' })
export class Review extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ type: 'text', nullable: false })
    message: string;

    @Column({ type: 'text', nullable: true })
    flag: string;

    @Column({ type: 'text', nullable: true })
    type: string;

    @Column({ default: false })
    resolved: boolean;

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

    @ManyToMany(() => Application, application => application.reviews)
    @JoinTable({
        name: 'review_application_relation',
        joinColumn: {
            name: 'review_pk',
            referencedColumnName: 'pk',
        },
        inverseJoinColumn: {
            name: 'application_pk',
            referencedColumnName: 'pk',
        }
    })
    applications: Application[];

    @ManyToMany(() => Document, (document) => document.reviews, { cascade: ['insert', 'update'] })
    documents: Document[];
}


