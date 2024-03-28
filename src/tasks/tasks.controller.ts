import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './TaskStatus';
import { title } from 'process';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/Get-task-Filter.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.entity';
import { promises } from 'readline';
import { AuthGuard } from '@nestjs/passport';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private taskService: TasksService) {}
  @Get()
  async getTasks(@Query() getTaskFilter: GetTaskFilterDto): Promise<Task[]> {
    return await this.taskService.getTasks(getTaskFilter);
  }

  // // without using dto post request
  // // @Post()
  // // createTask(@Body("title") title:string,@Body("description") description:string){
  // //     return this.taskService.createtask(title,description)
  // // }

  @Post()
  createTask(@Body() createtaskDto: CreateTaskDto): Promise<Task> {
    return this.taskService.createtask(createtaskDto);
  }

  @Get('/:id')
  async getTaskById(@Param('id') id: string): Promise<Task> {
    return await this.taskService.getTaskById(id);
  }

  @Delete('/:id')
  async deleteTaskById(@Param('id') id: string): Promise<void> {
    await this.taskService.deleteTaskById(id);
  }

  @Patch('/:id/status')
  updatetaskStatus(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.taskService.updatetaskStatus(id, updateTaskDto.status);
  }
}
