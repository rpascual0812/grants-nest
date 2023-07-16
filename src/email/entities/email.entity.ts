import { Account } from 'src/account/entities/account.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, Unique, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'emails' })
@Unique(['uuid'])
export class Email {
    @PrimaryGeneratedColumn()
    pk: number;

    // @ManyToOne(() => Account)
    // @JoinColumn({ name: 'account_pk' })
    // account: Account;

    @Column({ type: 'text', nullable: false })
    uuid: string;

    @Column({ type: 'text', nullable: false })
    from: string;

    @Column({ type: 'text', nullable: false })
    from_name: string;

    @Column({ type: 'text', nullable: false })
    to: string;

    @Column({ type: 'text', nullable: false })
    to_name: string;

    @Column({ type: 'text', nullable: true })
    cc: string;

    @Column({ type: 'text', nullable: true })
    bcc: string;

    @Column({ type: 'text', nullable: false })
    subject: string;

    @Column({ type: 'text', nullable: false })
    body: string;

    @Column({ name: 'user_pk', nullable: false })
    user_pk: number;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    @Column({ type: 'text', nullable: false, default: false })
    sent: string;

    @Column({ default: false })
    archived: boolean;

    /**
     * Relationship
     */

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_pk' })
    user: User;
}
