import { Account } from 'src/account/entities/account.entity';
import { Entity, Column, PrimaryGeneratedColumn, Unique, JoinColumn, OneToOne } from 'typeorm';

@Entity({ name: 'sessions' })
export class Session {
    @PrimaryGeneratedColumn()
    pk: number;

    @OneToOne(() => Account)
    @JoinColumn({ name: 'account_pk' })
    account: Account;

    @Column({ type: 'text', nullable: false })
    token: string;

    @Column({ type: 'timestamptz', nullable: true })
    expiration: Date;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;
}
