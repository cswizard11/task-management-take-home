import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '@task-management-take-home/data';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { OrgHierarchyModule } from '../org-hierarchy/org-hierarchy.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), OrgHierarchyModule],
  providers: [TaskService],
  controllers: [TaskController],
})
export class TaskModule { }
