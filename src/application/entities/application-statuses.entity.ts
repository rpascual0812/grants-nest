import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToOne, ManyToOne, JoinColumn, BaseEntity, OneToMany } from 'typeorm';
import { Application } from './application.entity';
import { Status } from 'src/status/entities/status.entity';

@Entity({ name: 'application_statuses' })
@Unique(['application_pk', 'status'])
export class ApplicationStatus extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ name: 'application_pk', nullable: false })
    application_pk: number;

    @Column({ type: 'text', nullable: true })
    status: string;

    @Column({ default: false })
    archived: boolean;

    /**
     * Relationship
     */

    // @ManyToOne(type => Application, application => application.statuses, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    // @JoinColumn({ name: 'application_pk' })
    // application: Application;
}
