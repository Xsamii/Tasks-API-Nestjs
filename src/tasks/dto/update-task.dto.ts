import { taskStatus } from "../task.model";

export class UpdateTaskDto { 
    id: string;
    status : taskStatus;
}