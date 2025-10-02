// Browser-safe exports for the frontend

// DTOs
export * from './lib/dto/create-task.dto';
export * from './lib/dto/login.dto';
export * from './lib/dto/update-task.dto';

// Enums
export * from './lib/enums/role.enum';
export * from './lib/enums/task-status.enum';

// Plain Interfaces (no decorators)
import { Role } from './lib/enums/role.enum';
import { TaskStatus } from './lib/enums/task-status.enum';

// A browser-safe version of the User entity
export interface User {
  id: number;
  email: string;
  role: Role;
  organizationId: number;
}

// A browser-safe version of the Task entity
export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  category?: string;
  ownerId: number;
  organizationId: number;
  createdAt: Date;
  updatedAt: Date;
  owner: User;
  organization: { id: number; name: string };
}
