import { IsEnum } from 'class-validator';
import { TaskStatus } from '../TaskStatus';

export class UpdateTaskDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
