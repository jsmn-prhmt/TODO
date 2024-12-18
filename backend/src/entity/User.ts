import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index({ unique: true })
  @Column({ unique: true, length: 50 })
  username!: string;

  @Column({ length: 255 })
  passwordHash!: string;
}