import { Entity, Column, PrimaryGeneratedColumn, Unique, JoinColumn, ManyToOne, OneToOne, BaseEntity, OneToMany, ManyToMany } from 'typeorm';
import { User } from './user.entity';
import { Role } from 'src/role/entities/role.entity';

@Entity({ name: 'user_roles' })
@Unique(['user_pk', 'role_pk'])
export class UserRole extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ name: 'user_pk', nullable: false })
    user_pk: number;

    @Column({ name: 'role_pk', nullable: false })
    role_pk: string;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    /**
     * Relationship
     */

    @ManyToOne('User', (user: User) => user.user_role)
    @JoinColumn({ name: 'user_pk' })
    user: User;

    @ManyToOne('Role', (role: Role) => role.user_role)
    @JoinColumn({ name: 'role_pk' })
    role: Role;
}
