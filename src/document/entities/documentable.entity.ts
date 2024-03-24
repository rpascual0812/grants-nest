import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, Unique, JoinColumn, ManyToOne, OneToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Document } from 'src/document/entities/document.entity';

@Entity({ name: 'documentable' })
@Unique(['type', 'table_name', 'table_pk', 'document_pk'])
export class Documentable {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ name: 'user_pk', nullable: false })
    user_pk: number;

    @Column({ type: 'text', nullable: false })
    table_name: string;

    @Column({ name: 'application_pk', nullable: false })
    table_pk: number;

    @Column({ type: 'text', nullable: true })
    type: string;

    @Column({ name: 'document_pk', nullable: false })
    document_pk: number;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    /**
     * Relationship
     */

    @ManyToOne(type => User, user => user.documentable, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'user_pk' })
    user: User;

    @OneToOne(type => Document, document => document.documentable, { eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'document_pk' })
    @JoinTable()
    document: Document[];
}
