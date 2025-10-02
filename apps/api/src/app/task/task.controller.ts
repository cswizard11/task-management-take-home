import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import {
  User,
  CreateTaskDto,
  UpdateTaskDto,
  Task,
} from '@task-management-take-home/data';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get()
  async getTasks(@GetUser() user: User): Promise<Task[]> {
    return this.taskService.getAccessibleTasks(user);
  }

  @Get(':id')
  async getTask(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number
  ): Promise<Task> {
    return this.taskService.getTaskById(user, id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createTask(
    @GetUser() user: User,
    @Body() createTaskDto: CreateTaskDto
  ): Promise<Task> {
    return this.taskService.createTask(user, createTaskDto);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async updateTask(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto
  ): Promise<Task> {
    return this.taskService.updateTask(user, id, updateTaskDto);
  }

  @Delete(':id')
  async deleteTask(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number
  ): Promise<void> {
    return this.taskService.deleteTask(user, id);
  }
}
