import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, Unique, JoinColumn, ManyToOne, OneToOne, BaseEntity, AfterLoad, OneToMany } from 'typeorm';

@Entity({ name: 'genders' })
@Unique(['name'])
export class Gender {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ type: 'text', nullable: false })
    name: string;

    @Column({ default: false })
    archived: boolean;

    /**
     * Relationship
     */
    @OneToMany('User', (user: User) => user.gender)
    @JoinColumn({ name: 'pk' })
    user: Array<User>;
}
