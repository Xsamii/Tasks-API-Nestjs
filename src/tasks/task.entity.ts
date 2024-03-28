import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from './TaskStatus';
import { IsEnum } from 'class-validator';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  title: string;
  @Column()
  description: string;

  @IsEnum(TaskStatus)
  @Column()
  status: TaskStatus;
}
