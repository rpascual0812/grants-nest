import { Entity, Column, PrimaryGeneratedColumn, Unique, JoinColumn, ManyToOne, OneToMany, ManyToMany, OneToOne, JoinTable } from 'typeorm';
import { Application } from 'src/application/entities/application.entity';
import { Review } from 'src/review/entities/review.entity';

@Entity({ name: 'documents' })
@Unique(['filename'])
export class Document {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ type: 'text', nullable: true })
    type: string;

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
    @ManyToMany(() => Application, application => application.documents)
    @JoinTable({
        name: 'document_application_relation',
        joinColumn: {
            name: 'document_pk',
            referencedColumnName: 'pk',
        },
        inverseJoinColumn: {
            name: 'application_pk',
            referencedColumnName: 'pk',
        }
    })
    applications: Application[];

    @ManyToMany(() => Review, review => review.documents)
    @JoinTable({
        name: 'document_review_relation',
        joinColumn: {
            name: 'document_pk',
            referencedColumnName: 'pk',
        },
        inverseJoinColumn: {
            name: 'review_pk',
            referencedColumnName: 'pk',
        }
    })
    reviews: Review[];
}
