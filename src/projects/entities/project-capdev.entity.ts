import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    Unique,
    OneToOne,
    ManyToOne,
    JoinColumn,
    BaseEntity,
    OneToMany,
} from 'typeorm';
import { Project } from './project.entity';
import { User } from 'src/user/entities/user.entity';

@Entity({ name: 'project_capdevs' })
export class ProjectCapDev extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ name: 'project_pk', nullable: false })
    project_pk: number;

    @Column({ type: 'text', nullable: false })
    knowledge: string;

    @Column({ type: 'text', nullable: false })
    instruction: string;

    @Column({ type: 'text', nullable: false })
    remarks: string;

    @Column({ name: 'created_by', nullable: false })
    created_by: number;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    @Column({ default: false })
    archived: boolean;

    /**
     * Relationship
     */
    @ManyToOne((type) => Project, (project) => project.project_capdev, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'project_pk' })
    project: Project;

    @ManyToOne((type) => User, (user) => user.project_capdev, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'created_by' })
    user: User;
}
