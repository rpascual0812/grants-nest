import { UserRole } from 'src/user/entities/user-role.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, Unique, JoinColumn, ManyToOne, OneToMany, BaseEntity, OneToOne, ManyToMany } from 'typeorm';

@Entity({ name: 'templates' })
@Unique(['type'])
export class Template extends BaseEntity {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    pk: number;

    @Column({ type: 'text', nullable: false })
    type: string;

    @Column({ type: 'text', nullable: false })
    subject: string;

    @Column({ type: 'text', nullable: true })
    cc: string;

    @Column({ type: 'text', nullable: true })
    bcc: string;

    @Column({ type: 'text', nullable: true })
    template: string;

    @Column({ name: 'created_by', nullable: false })
    created_by: number;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    /**
     * Relationship
     */

    @ManyToOne((type) => User, (user) => user.template, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'created_by' })
    user: User;
}
