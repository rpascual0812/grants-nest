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
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Partner } from 'src/partner/entities/partner.entity';
import { ApplicationNonprofitEquivalencyDetermination } from './application-nonprofit-equivalency-determination.entity';
import { ApplicationStatus } from './application-statuses.entity';
import { Project } from 'src/projects/entities/project.entity';
import { Review } from 'src/review/entities/review.entity';
import { Type } from 'src/type/entities/type.entity';
import { Document } from 'src/document/entities/document.entity';
import { ApplicationRecommendation } from './application-recommendation.entity';

@Entity({ name: 'applications' })
@Unique(['uuid'])
@Unique(['number'])
export class Application extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ type: 'text', nullable: false })
    uuid: string;

    @Column({ name: 'number', nullable: false })
    number: string;

    @Column({ name: 'partner_pk', nullable: false })
    partner_pk: number;

    @Column({ default: false })
    approved: boolean;

    @Column({ type: 'text', nullable: true })
    donor: string;

    @Column({ name: 'created_by', nullable: false })
    created_by: number;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    @Column({ default: false })
    archived: boolean;

    /**
     * Relationship
     */

    @ManyToOne((type) => User, (user) => user.application, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'created_by' })
    user: User;

    @ManyToOne((type) => Partner, (partner) => partner.application, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'partner_pk' })
    partner: Partner;

    @OneToOne((type) => Project, (project) => project.application, { cascade: true })
    project: Project;

    @OneToOne(
        (type) => ApplicationNonprofitEquivalencyDetermination,
        (application_nonprofit_equivalency_determination) =>
            application_nonprofit_equivalency_determination.application,
        { cascade: true },
    )
    application_nonprofit_equivalency_determination: ApplicationNonprofitEquivalencyDetermination;

    @OneToMany('ApplicationRecommendation', (applicationRecommendation: ApplicationRecommendation) => applicationRecommendation.application)
    @JoinColumn({ name: 'pk' })
    recommendations: Array<ApplicationRecommendation>;

    @OneToMany('ApplicationStatus', (application_statuses: ApplicationStatus) => application_statuses.application)
    @JoinColumn({ name: 'pk' })
    application_statuses: Array<ApplicationStatus>;

    @ManyToMany(() => Review, (review) => review.applications, { cascade: ['insert', 'update'] })
    reviews: Review[];

    @ManyToMany(() => Document, (document) => document.applications, { cascade: ['insert', 'update'] })
    documents: Document[];

    @ManyToMany(() => Type, (type) => type.applications, { cascade: ['insert', 'update'] })
    types: Type[];
}
