import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './TaskStatus';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/Get-task-Filter.dto';
import { rmSync, stat } from 'fs';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}

  async getTasks(filterDto: GetTaskFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.taskRepo.createQueryBuilder('task');
    status && query.andWhere('task.status = :status', { status });
    search &&
      query.andWhere(
        'lower(task.title) Like :search or task.description Like :search',
        { search: `%${search}%` },
      );
    const tasks = await query.getMany();
    return tasks;
  }

  async createtask(createtaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createtaskDto;
    const task = this.taskRepo.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.taskRepo.save(task);
    return task;
  }

  async getTaskById(id: string): Promise<Task> {
    const task = await this.taskRepo.findOneBy({ id });
    if (!task) {
      throw new NotFoundException('there is no task with this id ');
    }
    return task;
  }

  async deleteTaskById(id): Promise<void> {
    // const task = await this.getTaskById(id);
    const res = await this.taskRepo.delete(id);
    if (res.affected === 0) {
      throw new NotFoundException(`there is no task With the id: ${id}`);
    }
  }

  async updatetaskStatus(id: string, newStatus: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = newStatus;
    await this.taskRepo.save(task);
    return task;
  }

  // public getFilteredTasks(filterDto: GetTaskFilterDto): Task[] {
  //   const { status, search } = filterDto;
  //   return this.getAllTasks();
  // }
}
