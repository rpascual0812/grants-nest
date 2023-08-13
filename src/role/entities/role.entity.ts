import { UserRole } from 'src/user/entities/user-role.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, Unique, JoinColumn, ManyToOne, OneToMany, BaseEntity, OneToOne, ManyToMany } from 'typeorm';

@Entity({ name: 'roles' })
@Unique(['name'])
export class Role extends BaseEntity {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    pk: number;

    @Column({ type: 'text', nullable: false })
    name: string;

    @Column({ type: 'text', nullable: true })
    details: string;

    @Column({ default: false })
    archived: boolean;

    /**
     * Relationship
     */

    @OneToMany(type => UserRole, user_role => user_role.role, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'pk' })
    user_role: UserRole;
}
