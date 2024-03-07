import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToOne, ManyToOne, JoinColumn, BaseEntity, OneToMany } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Application } from './application.entity';
import { ApplicationProponentContact } from './application-proponent-contact.entity';

@Entity({ name: 'application_proponents' })
export class ApplicationProponent extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ name: 'application_pk', nullable: false })
    application_pk: number;

    @Column({ type: 'text', nullable: false })
    name: string;

    @Column({ type: 'text', nullable: false })
    address: string;

    @Column({ type: 'text', nullable: false })
    contact_number: string;

    @Column({ type: 'text', nullable: false })
    email_address: string;

    @Column({ type: 'text', nullable: false })
    website: string;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    /**
     * Relationship
     */

    @OneToMany('ApplicationProponentContact', (applicationProponentContact: ApplicationProponentContact) => applicationProponentContact.application_proponent, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'application_contact_person_pk' })
    contacts: ApplicationProponentContact;

    @OneToOne(type => Application, application => application.application_proponent, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'application_pk' })
    application: Application;
}
