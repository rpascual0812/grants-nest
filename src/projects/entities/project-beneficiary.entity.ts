import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, BaseEntity, UpdateDateColumn } from 'typeorm';
import { Project } from './project.entity';

@Entity({ name: 'project_beneficiaries' })
// @Unique(['project_pk', 'type', 'name'])
export class ProjectBeneficiary extends BaseEntity {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ name: 'project_pk', nullable: false })
    project_pk: number;

    @Column({ name: 'women_count', nullable: false })
    women_count: number;

    @Column({ name: 'women_diffable_count', nullable: false })
    women_diffable_count: number;

    @Column({ name: 'women_other_vulnerable_sector_count', nullable: false })
    women_other_vulnerable_sector_count: number;

    @Column({ name: 'young_women_count', nullable: false })
    young_women_count: number;

    @Column({ name: 'young_women_diffable_count', nullable: false })
    young_women_diffable_count: number;

    @Column({ name: 'young_women_other_vulnerable_sector_count', nullable: false })
    young_women_other_vulnerable_sector_count: number;

    @Column({ name: 'men_count', nullable: false })
    men_count: number;

    @Column({ name: 'men_diffable_count', nullable: false })
    men_diffable_count: number;

    @Column({ name: 'men_other_vulnerable_sector_count', nullable: false })
    men_other_vulnerable_sector_count: number;

    @Column({ name: 'young_men_count', nullable: false })
    young_men_count: number;

    @Column({ name: 'young_men_diffable_count', nullable: false })
    young_men_diffable_count: number;

    @Column({ name: 'young_men_other_vulnerable_sector_count', nullable: false })
    young_men_other_vulnerable_sector_count: number;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    @UpdateDateColumn()
    date_updated: Date;

    /**
     * Relationship
     */
    @ManyToOne((type) => Project, (project) => project.project_beneficiary, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'project_pk' })
    project: Project;
}
