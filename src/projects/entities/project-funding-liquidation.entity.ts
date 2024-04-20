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
    JoinTable,
    ManyToMany,
} from 'typeorm';
import { ProjectFunding } from './project-funding.entity';
import { Document } from 'src/document/entities/document.entity';

@Entity({ name: 'project_funding_liquidations' })
export class ProjectFundingLiquidation extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ name: 'project_funding_pk', nullable: false })
    project_funding_pk: number;

    @Column({ type: 'text', nullable: false })
    description: string;

    @Column({ type: 'decimal', name: 'amount_usd', nullable: false })
    amount_usd: number;

    @Column({ type: 'decimal', name: 'amount_other', nullable: false })
    amount_other: number;

    @Column({ type: 'text', nullable: false })
    amount_other_currency: string;

    @Column({ type: 'text', nullable: false })
    status: string;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;



    /**
     * Relationship
     */
    @OneToOne(type => ProjectFunding, project_funding => project_funding.project_funding_liquidation, { eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'project_funding_pk' })
    @JoinTable()
    project_funding: ProjectFunding;

    @ManyToMany(() => Document, (document) => document.project_funding_liquidations, { cascade: ['insert', 'update'] })
    documents: Document[];
}
