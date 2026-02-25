// src/users/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @Column({ unique: true })
    username!: string;

    @Column({ nullable: true, unique: true })
    email?: string;

    @Column({ nullable: true, unique: true })
    phone?: string;

    @Column()
    passwordHash!: string;

    @Column({ nullable: true })
    refreshTokenHash?: string | null;

    // ✅ NEW
    @Column({ type: 'timestamptz', nullable: true })
    lastLoginAt?: Date | null;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}