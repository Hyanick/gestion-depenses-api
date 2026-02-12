import { Category } from '../categories/category.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;


  @Column()
  icon: string;

  @Column()
  description: string;

  @Column()
  date: string;

  @Column('decimal')
  amount: number;

  @Column()
  type: 'income' | 'expense';

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column()
  categoryId: number;
}
