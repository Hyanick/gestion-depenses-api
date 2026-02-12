import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  icon: string;

  @Column()
  type: 'income' | 'expense'; // Pour distinguer les catégories de revenus/dépenses

  @Column({ default: '#1976d2' })
  color: string;
}
