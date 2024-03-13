import { Injectable } from '@nestjs/common';
import {Task,taskStatus} from "./task.model"
import {v4 as uuid}from "uuid"
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/Get-task-Filter.dto';
import { stat } from 'fs';
@Injectable()
export class TasksService {

    private tasks:Task[] = []

    public getAllTasks():Task[]{
        return this.tasks
    }
// without using dto
    // public createtask(title:string,description:string):Task{
    //     const task :Task = {
    //         id:uuid(),
    //         title,
    //         description,
    //         status:taskStatus.OPEN
    //     }
    //     this.tasks.push(task);
    //     return task;
    // }
    public createtask(createtaskDto:CreateTaskDto):Task{

        const {title,description} = createtaskDto
        const task :Task = {
            id:uuid(),
            title,
            description,
            status:taskStatus.OPEN
        }
        this.tasks.push(task);
        return task;
    }

    public getTaskById(id:string):Task{
        return this.tasks.find((t)=>t.id===id)
    }

    public deleteTaskById(id):void{
        this.tasks = this.tasks.filter((t)=>t.id!==id)
    }

    public updatetaskStatus(id:string , newStatus:taskStatus):Task{
        
        const task = this.getTaskById(id);
        task.status = newStatus;
        return  task;
    }
    public getFilteredTasks(filterDto:GetTaskFilterDto):Task[]{
        const {status , search} =  filterDto;

   return this.getAllTasks();
    }
}
