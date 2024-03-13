import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, taskStatus } from './task.model';
import { title } from 'process';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/Get-task-Filter.dto';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}
  @Get()
  getTasks(@Query() getTaskFilter: GetTaskFilterDto): Task[] {
    if (Object.keys(getTaskFilter).length) {
      this.taskService.getFilteredTasks(getTaskFilter);
    } else {
      return this.taskService.getAllTasks();
    }
  }

  // without using dto post request
  // @Post()
  // createTask(@Body("title") title:string,@Body("description") description:string){
  //     return this.taskService.createtask(title,description)
  // }

  @Post()
  createTask(@Body() createtaskDto: CreateTaskDto) {
    return this.taskService.createtask(createtaskDto);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Task {
    return this.taskService.getTaskById(id);
  }

  @Delete('/:id')
  deleteTaskById(@Param('id') id: string): void {
    return this.taskService.deleteTaskById(id);
  }

  @Patch('/:id/status')
  updatetaskStatus(
    @Param('id') id: string,
    @Body('status') status: taskStatus,
  ): Task {
    return this.taskService.updatetaskStatus(id, status);
  }
}
