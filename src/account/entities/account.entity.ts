import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToOne, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity({ name: 'accounts' })
@Unique(['username'])
export class Account {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ type: 'text', nullable: false })
    username: string;

    @Column({ type: 'text', nullable: false })
    password: string;

    @Column({ default: true })
    active: boolean;

    @Column({ default: false })
    verified: boolean;

    @Column({ type: 'jsonb', nullable: true })
    password_reset: JSON;

    @Column({ default: false })
    archived: boolean;

    /** 
     * Relationship
     */

    @OneToOne(type => User, user => user.account, { cascade: true })
    user: User;
}
