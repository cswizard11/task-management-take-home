import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Organization } from './organization.entity';
import { User } from './user.entity';
import { TaskStatus } from '../enums/task-status.enum';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'simple-enum',
    enum: TaskStatus,
    default: TaskStatus.TODO
  })
  status: TaskStatus;

  @Column({ nullable: true })
  category: string;

  @Column()
  ownerId: number;

  @ManyToOne(() => User, (user) => user.tasks)
  owner: User;

  @Column()
  organizationId: number;

  @ManyToOne(() => Organization, (org) => org.tasks)
  organization: Organization;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
