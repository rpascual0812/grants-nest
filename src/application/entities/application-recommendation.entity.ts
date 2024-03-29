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
import { Application } from './application.entity';
import { User } from 'src/user/entities/user.entity';

@Entity({ name: 'application_recommendations' })
export class ApplicationRecommendation extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ name: 'application_pk', nullable: false })
    application_pk: number;

    @Column({ type: 'text', nullable: false })
    type: string;

    @Column({ type: 'text', nullable: false })
    recommendation: string;

    @Column({ name: 'created_by', nullable: false })
    created_by: number;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    /**
     * Relationship
     */

    @ManyToOne(type => Application, application => application.recommendations, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'application_pk' })
    application: Application;

    @ManyToOne((type) => User, (user) => user.recommendation, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'created_by' })
    user: User;

}
