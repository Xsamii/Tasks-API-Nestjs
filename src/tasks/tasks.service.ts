import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './TaskStatus';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/Get-task-Filter.dto';
import { rmSync, stat } from 'fs';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}

  async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.taskRepo.createQueryBuilder('task');
    query.where({ user });
    status && query.andWhere('task.status = :status', { status });
    search &&
      query.andWhere(
        '(lower(task.title) Like :search or task.description Like :search)',
        { search: `%${search}%` },
      );
    const tasks = await query.getMany();
    return tasks;
  }

  async createtask(createtaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createtaskDto;
    const task = this.taskRepo.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    await this.taskRepo.save(task);
    return task;
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const task = await this.taskRepo.findOneBy({ id, user });

    if (!task) {
      throw new NotFoundException('there is no task with this id ');
    }
    return task;
  }

  async deleteTaskById(id, user: User): Promise<void> {
    // const task = await this.getTaskById(id);
    const res = await this.taskRepo.delete({ id, user });
    if (res.affected === 0) {
      throw new NotFoundException(`there is no task With the id: ${id}`);
    }
  }

  async updatetaskStatus(
    id: string,
    newStatus: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = newStatus;
    await this.taskRepo.save(task);
    return task;
  }

  // public getFilteredTasks(filterDto: GetTaskFilterDto): Task[] {
  //   const { status, search } = filterDto;
  //   return this.getAllTasks();
  // }
}
