import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import {
  Task,
  User,
  CreateTaskDto,
  UpdateTaskDto,
  Role,
} from '@task-management-take-home/data';
import { OrgHierarchyService } from '../org-hierarchy/org-hierarchy.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepo: Repository<Task>,
    private orgHierarchyService: OrgHierarchyService
  ) { }

  async getAccessibleTasks(user: User): Promise<Task[]> {
    const accessibleOrgIds = await this.orgHierarchyService.getAccessibleOrgIds(
      user
    );

    return this.taskRepo.find({
      where: {
        organizationId: In(accessibleOrgIds),
      },
      relations: ['owner', 'organization'],
      order: { createdAt: 'DESC' },
    });
  }

  async getTaskById(user: User, id: number): Promise<Task> {
    const task = await this.taskRepo.findOne({
      where: { id },
      relations: ['owner', 'organization'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const canAccess = await this.orgHierarchyService.canAccessOrganization(
      user,
      task.organizationId
    );
    if (!canAccess) {
      throw new ForbiddenException('You do not have access to this task');
    }

    return task;
  }

  async createTask(user: User, createTaskDto: CreateTaskDto): Promise<Task> {
    if (user.role === Role.VIEWER) {
      throw new ForbiddenException('Viewers cannot create tasks');
    }

    const targetOrgId = createTaskDto.organizationId || user.organizationId;

    if (targetOrgId !== user.organizationId) {
      if (user.role !== Role.ADMIN) {
        throw new ForbiddenException(
          'Only Admins can create tasks in other organizations'
        );
      }

      const canAccess = await this.orgHierarchyService.canAccessOrganization(
        user,
        targetOrgId
      );
      if (!canAccess) {
        throw new ForbiddenException(
          'You do not have access to this organization'
        );
      }
    }

    const task = this.taskRepo.create({
      ...createTaskDto,
      ownerId: user.id,
      organizationId: targetOrgId,
    });

    return this.taskRepo.save(task);
  }

  async updateTask(
    user: User,
    id: number,
    updateTaskDto: UpdateTaskDto
  ): Promise<Task> {
    if (user.role === Role.VIEWER) {
      throw new ForbiddenException('Viewers cannot update tasks');
    }

    const task = await this.taskRepo.findOne({
      where: { id },
      relations: ['organization'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.organizationId !== user.organizationId) {
      if (user.role !== Role.ADMIN) {
        throw new ForbiddenException(
          'Only Admins can update tasks in other organizations'
        );
      }

      const canAccess = await this.orgHierarchyService.canAccessOrganization(
        user,
        task.organizationId
      );
      if (!canAccess) {
        throw new ForbiddenException('You do not have access to this task');
      }
    }

    await this.taskRepo.update(id, updateTaskDto);
    return this.taskRepo.findOne({
      where: { id },
      relations: ['owner', 'organization'],
    });
  }

  async deleteTask(user: User, id: number): Promise<void> {
    if (user.role === Role.VIEWER) {
      throw new ForbiddenException('Viewers cannot delete tasks');
    }

    const task = await this.taskRepo.findOne({
      where: { id },
      relations: ['organization'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.organizationId !== user.organizationId) {
      if (user.role !== Role.ADMIN) {
        throw new ForbiddenException(
          'Only Admins can delete tasks in other organizations'
        );
      }

      const canAccess = await this.orgHierarchyService.canAccessOrganization(
        user,
        task.organizationId
      );
      if (!canAccess) {
        throw new ForbiddenException('You do not have access to this task');
      }
    }

    await this.taskRepo.delete(id);
  }
}
