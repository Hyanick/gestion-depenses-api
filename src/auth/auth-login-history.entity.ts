import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('auth_login_history')
@Index(['userId', 'createdAt'])
export class AuthLoginHistoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId!: string | null;

  @Column({ nullable: true })
  username!: string | null;

  @Column({ nullable: true })
  ip!: string | null;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent!: string | null;

  @Column({ default: true })
  success!: boolean;

  @Column({ type: 'varchar', nullable: true })
  reason!: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}