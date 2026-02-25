import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ length: 120 })
    name!: string;

    @Column({ unique: true })
    username!: string;

    @Column({ nullable: true, unique: true })
    email?: string;

    @Column({ nullable: true, unique: true })
    phone?: string;

    @Column({ name: 'password_hash' })
    passwordHash!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}