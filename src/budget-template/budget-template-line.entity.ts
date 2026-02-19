import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('budget_template_lines')
export class BudgetTemplateLine {
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
}
