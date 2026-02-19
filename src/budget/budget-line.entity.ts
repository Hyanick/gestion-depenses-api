import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { BudgetMonth } from './budget-month.entity';

@Entity('budget_lines')
export class BudgetLine {
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

  @ManyToOne(() => BudgetMonth, (month) => month.lines, { onDelete: 'CASCADE' })
  month: BudgetMonth;
}
