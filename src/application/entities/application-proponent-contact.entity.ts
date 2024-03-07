import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToOne, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { Application } from './application.entity';
import { ApplicationProponent } from './application-proponent.entity';

@Entity({ name: 'application_proponent_contacts' })
export class ApplicationProponentContact {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ name: 'application_proponent_pk', nullable: false })
    application_proponent_pk: number;

    @Column({ type: 'text', nullable: false })
    name: string;

    @Column({ type: 'text', nullable: false })
    contact_number: string;

    @Column({ type: 'text', nullable: false })
    email_address: string;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    /**
     * Relationship
     */

    @ManyToOne(type => ApplicationProponent, application_proponent => application_proponent.contacts, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'application_proponent_pk' })
    application_proponent: ApplicationProponent;

}
