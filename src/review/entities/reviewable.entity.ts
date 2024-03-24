import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, Unique, JoinColumn, ManyToOne, OneToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Document } from 'src/document/entities/document.entity';
import { Review } from './review.entity';

@Entity({ name: 'reviewable' })
@Unique(['type', 'table_name', 'table_pk', 'review_pk'])
export class Reviewable {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ name: 'user_pk', nullable: true })
    user_pk: number;

    @Column({ type: 'text', nullable: false })
    table_name: string;

    @Column({ name: 'table_pk', nullable: false })
    table_pk: number;

    @Column({ type: 'text', nullable: true })
    type: string;

    @Column({ name: 'review_pk', nullable: false })
    review_pk: number;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    /**
     * Relationship
     */

    @ManyToOne(type => User, user => user.reviewable, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'user_pk' })
    user: User;

    @OneToOne(type => Review, review => review.reviewable, { eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'review_pk' })
    @JoinTable()
    review: Review[];
}
