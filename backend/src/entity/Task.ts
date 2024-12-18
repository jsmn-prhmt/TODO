import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from "typeorm";
import { User } from "./User";
import { Group } from "./Group";

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 200 })
  title!: string;

  @Index()
  @Column({ nullable: true })
  deadline!: string;

  @Column({ default: false })
  completed!: boolean;

  @ManyToOne(() => User, { nullable: false })
  user!: User;

  @ManyToOne(() => Group, group => group.tasks, { nullable: true })
  group!: Group | null;
}