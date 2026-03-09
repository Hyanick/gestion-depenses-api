import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Index,
} from 'typeorm';

export type BudgetHistoryAction =
    | 'create'
    | 'update'
    | 'delete'
    | 'replace_month';

@Entity('budget_line_history')
@Index(['userId', 'monthKey'])
export class BudgetLineHistoryEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'user_id', type: 'uuid' })
    userId!: string;

    @Column()
    monthKey!: string;

    @Column({ name: 'line_id', type: 'uuid', nullable: true })
    lineId!: string | null;

    @Column({ type: 'varchar' })
    action!: BudgetHistoryAction;

    @Column({ type: 'jsonb', nullable: true })
    before!: any | null;

    @Column({ type: 'jsonb', nullable: true })
    after!: any | null;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt!: Date;
}