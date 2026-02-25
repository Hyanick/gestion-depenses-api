import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { BudgetMonthEntity } from './budget-month.entity';


@Entity('budget_lines')
export class BudgetLineEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: 'income' | 'expense';

  @Column()
  category: string;

  @Column()
  label: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  amount: number;

  @Column()
  icon: string;

  @Column()
  color: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => BudgetMonthEntity, (month) => month.lines, { onDelete: 'CASCADE' })
  month: BudgetMonthEntity;


}
