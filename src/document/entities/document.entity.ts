import { Entity, Column, PrimaryGeneratedColumn, Unique, JoinColumn, ManyToOne, OneToMany, ManyToMany, OneToOne } from 'typeorm';
import { UserDocument } from 'src/user/entities/user-document.entity';
import { ApplicationDocument } from 'src/application/entities/application-document.entity';

@Entity({ name: 'documents' })
@Unique(['filename'])
export class Document {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ type: 'text', nullable: false })
    original_name: string;

    @Column({ type: 'text', nullable: false })
    filename: string;

    @Column({ type: 'text', nullable: false })
    path: string;

    @Column({ type: 'text', nullable: false })
    mime_type: string;

    @Column({ type: 'numeric' })
    size: number;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    @Column({ default: false })
    archived: boolean;

    /**
     * Relationship
     */

    @OneToOne(type => UserDocument, user_document => user_document.document, { cascade: true })
    user_document: UserDocument;

    @OneToOne(type => ApplicationDocument, application_document => application_document.document, { cascade: true })
    application_document: ApplicationDocument;
}
