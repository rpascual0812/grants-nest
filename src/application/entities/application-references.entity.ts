import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToOne, ManyToOne, JoinColumn, BaseEntity, OneToMany } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { ApplicationContactPerson } from './application-contact-person.entity';
import { Application } from './application.entity';

@Entity({ name: 'application_references' })
@Unique(['application_pk', 'name', 'contact_number'])
export class ApplicationReference extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ name: 'application_pk', nullable: false })
    application_pk: number;

    @Column({ type: 'text', nullable: false })
    name: string;

    @Column({ type: 'text', nullable: false })
    contact_number: string;

    @Column({ type: 'text', nullable: false })
    email_address: string;

    @Column({ type: 'text', nullable: false })
    organization_name: string;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    /**
     * Relationship
     */
    @ManyToOne(type => Application, application => application.application_reference, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'application_pk' })
    application: Application;
}
