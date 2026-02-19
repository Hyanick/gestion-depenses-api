import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BudgetLine } from './budget-line.entity';

@Entity('budget_months')
export class BudgetMonth {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  monthKey: string; // "2026-02"

  @Column({ default: 'template' })
  createdFrom: 'template' | 'duplicate' | 'manual';

  @OneToMany(() => BudgetLine, (line) => line.month, {
    cascade: true,
    eager: true,
  })
  lines: BudgetLine[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
