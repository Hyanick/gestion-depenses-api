import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { BudgetLineEntity } from './budget-line.entity';

@Entity('budget_months')
@Index(['userId', 'monthKey'], { unique: true }) // ✅ UNIQUE PAR USER + MOIS
export class BudgetMonthEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  monthKey: string; // ✅ plus unique ici

  @Column({ default: 'template' })
  createdFrom: 'template' | 'duplicate' | 'manual';

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @OneToMany(() => BudgetLineEntity, (line) => line.month, {
    cascade: true,
    eager: true,
  })
  lines: BudgetLineEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}