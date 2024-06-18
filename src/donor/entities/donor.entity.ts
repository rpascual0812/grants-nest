import { ProjectFunding } from 'src/projects/entities/project-funding.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToOne, ManyToOne, JoinColumn, BaseEntity, OneToMany } from 'typeorm';

@Entity({ name: 'donors' })
@Unique(['code', 'name'])
export class Donor extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ type: 'text', nullable: false })
    code: string;

    @Column({ type: 'text', nullable: false })
    name: string;

    @Column({ name: 'created_by', nullable: false })
    created_by: number;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_updated: Date;

    @Column({ default: true })
    active: boolean;

    @Column({ default: false })
    archived: boolean;

    /**
     * Relationship
     */

    @ManyToOne((type) => User, (user) => user.donor, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'created_by' })
    user: User;

    @OneToMany(
        'ProjectFunding',
        (projectFunding: ProjectFunding) => projectFunding.donor,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
    )
    @JoinColumn({ name: 'pk' })
    project_funding: ProjectFunding;
}
