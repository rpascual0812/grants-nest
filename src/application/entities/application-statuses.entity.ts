import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToOne, ManyToOne, JoinColumn, BaseEntity, OneToMany } from 'typeorm';
import { Application } from './application.entity';
import { Status } from 'src/status/entities/status.entity';

@Entity({ name: 'application_statuses' })
@Unique(['application_pk', 'status_pk'])
export class ApplicationStatus extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ name: 'application_pk', nullable: false })
    application_pk: number;

    @Column({ name: 'status_pk', nullable: false })
    status_pk: number;

    @Column({ default: false })
    archived: boolean;

    /**
     * Relationship
     */

    @ManyToOne(type => Application, application => application.application_statuses, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'application_pk' })
    application: Application;

    @ManyToOne(type => Status, status => status.application_status, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'status_pk' })
    status: Status;
}
