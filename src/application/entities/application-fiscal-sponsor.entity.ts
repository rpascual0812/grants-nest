import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToOne, ManyToOne, JoinColumn, BaseEntity, OneToMany } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { ApplicationContactPerson } from './application-contact-person.entity';
import { Application } from './application.entity';

@Entity({ name: 'application_fiscal_sponsors' })
export class ApplicationFiscalSponsor extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ name: 'application_pk', nullable: false })
    application_pk: number;

    @Column({ type: 'text', nullable: false })
    name: string;

    @Column({ type: 'text', nullable: false })
    address: string;

    @Column({ type: 'text', nullable: false })
    head: string;

    @Column({ type: 'text', nullable: false })
    person_in_charge: string;

    @Column({ type: 'text', nullable: false })
    contact_number: string;

    @Column({ type: 'text', nullable: false })
    email_address: string;

    @Column({ type: 'text', nullable: false })
    bank_account_name: string;

    @Column({ type: 'text', nullable: false })
    account_number: string;

    @Column({ type: 'text', nullable: false })
    bank_name: string;

    @Column({ type: 'text', nullable: false })
    bank_branch: string;

    @Column({ type: 'text', nullable: false })
    bank_address: string;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    /**
     * Relationship
     */
    @OneToOne(type => Application, application => application.application_fiscal_sponsor, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'application_pk' })
    application: Application;
}
