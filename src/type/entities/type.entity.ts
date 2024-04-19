import { ApplicationStatus } from 'src/application/entities/application-statuses.entity';
import { Application } from 'src/application/entities/application.entity';
import { ProjectStatus } from 'src/projects/entities/project-statuses.entity';
import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/user/entities/user.entity';
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
    ManyToMany,
    JoinTable,
} from 'typeorm';

@Entity({ name: 'types' })
@Unique(['name'])
export class Type extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ type: 'text', nullable: false })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ name: 'created_by', nullable: false })
    created_by: number;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    @Column({ default: false })
    archived: boolean;

    /**
     * Relationship
     */

    @ManyToOne((type) => User, (user) => user.type, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'created_by' })
    user: User;

    // @ManyToMany(() => Application, (application) => application.types)
    // @JoinTable({
    //     name: 'type_application_relation',
    //     joinColumn: {
    //         name: 'type_pk',
    //         referencedColumnName: 'pk',
    //     },
    //     inverseJoinColumn: {
    //         name: 'application_pk',
    //         referencedColumnName: 'pk',
    //     }
    // })
    // applications: Application[];

    @OneToMany('Project', (project: Project) => project.type)
    @JoinColumn({ name: 'pk' })
    project: Array<Project>;
}
