import { IsEnum } from 'class-validator';
import { taskStatus } from '../task.model';

export class UpdateTaskDto {
  @IsEnum(taskStatus)
  status: taskStatus;
}
