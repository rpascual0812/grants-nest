import { ApplicationStatus } from 'src/application/entities/application-statuses.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToOne, ManyToOne, JoinColumn, BaseEntity, OneToMany } from 'typeorm';

@Entity({ name: 'statuses' })
@Unique(['parent_pk', 'name'])
export class Status extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ type: 'text', nullable: false })
    name: string;

    @Column({ name: 'parent_pk', nullable: true })
    parent_pk: number;

    @Column({ type: 'text', nullable: false })
    description: string;

    @Column({ name: 'sort', nullable: false })
    sort: number;

    @Column({ name: 'created_by', nullable: false })
    created_by: number;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    @Column({ default: false })
    archived: boolean;

    /**
     * Relationship
     */

    @OneToMany('ApplicationStatus', (applicationStatus: ApplicationStatus) => applicationStatus.status)
    @JoinColumn({ name: 'pk' })
    application_status: Array<ApplicationStatus>;

    @ManyToOne(type => User, user => user.status, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'created_by' })
    user: User;
}

