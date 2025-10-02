import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Organization } from './organization.entity';
import { Task } from './task.entity';
import { Role } from '../enums/role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'simple-enum',
    enum: Role,
    default: Role.VIEWER
  })
  role: Role;

  @Column()
  organizationId: number;

  @ManyToOne(() => Organization, (org) => org.users)
  organization: Organization;

  @OneToMany(() => Task, (task) => task.owner)
  tasks: Task[];
}
