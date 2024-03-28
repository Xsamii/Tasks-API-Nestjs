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
import { getUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private taskService: TasksService) {}
  @Get()
  async getTasks(
    @Query() getTaskFilter: GetTaskFilterDto,
    @getUser() user: User,
  ): Promise<Task[]> {
    return await this.taskService.getTasks(getTaskFilter, user);
  }

  // // without using dto post request
  // // @Post()
  // // createTask(@Body("title") title:string,@Body("description") description:string){
  // //     return this.taskService.createtask(title,description)
  // // }

  @Post()
  createTask(
    @Body() createtaskDto: CreateTaskDto,
    @getUser() user: User,
  ): Promise<Task> {
    return this.taskService.createtask(createtaskDto, user);
  }

  @Get('/:id')
  async getTaskById(
    @Param('id') id: string,
    @getUser() user: User,
  ): Promise<Task> {
    return await this.taskService.getTaskById(id, user);
  }

  @Delete('/:id')
  async deleteTaskById(
    @Param('id') id: string,
    @getUser() user: User,
  ): Promise<void> {
    await this.taskService.deleteTaskById(id, user);
  }

  @Patch('/:id/status')
  updatetaskStatus(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @getUser() user: User,
  ): Promise<Task> {
    return this.taskService.updatetaskStatus(id, updateTaskDto.status, user);
  }
}
