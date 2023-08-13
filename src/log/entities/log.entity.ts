import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, Unique, JoinColumn, ManyToOne, OneToMany, BaseEntity } from 'typeorm';

@Entity({ name: 'logs' })
export class Log extends BaseEntity {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    pk: number;

    @Column({ type: 'text', nullable: false })
    model: string;

    @Column({ type: 'int', nullable: false })
    model_pk: number;

    @Column({ type: 'jsonb', nullable: true })
    details: string;

    @Column({ name: 'user_pk', nullable: false })
    user_pk: number;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    /**
     * Relationship
     */

    @ManyToOne('User', (user: User) => user.log, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'user_pk' })
    user: User;
}
