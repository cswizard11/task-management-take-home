import { IsString, IsOptional, IsEnum } from 'class-validator';
import { TaskStatus } from '../enums/task-status.enum';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;
}
