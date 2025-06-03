import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Task } from './tasks.model';
import { TaskDto } from './dto/tasks.dto';
import { TaskStatusDto } from './dto/tasks_status.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TaskService {
    constructor(private prisma: PrismaService) {}

    async getAllTasks(): Promise<Task[]> {
        return this.prisma.tasks.findMany();
    }

    async getTask(id:number): Promise<Task> {
        return this.prisma.tasks.findUniqueOrThrow({where:{id}});
    }

    async createTask( dto: TaskDto) {
        return this.prisma.tasks.create({
    data: {
      title: dto.title,
      description: dto.description,
      status_id : dto.status_id,
      tasks: {
      create: dto.sub_tasks.map(subTask => ({ title: subTask.title })),
      },
    },
    include: {
      tasks: true,
    },
  });

}

    async updateTask(id: number, data: TaskDto): Promise<any> {
      const existingTask = await this.prisma.tasks.findUnique({
        where: { id },
        include: { tasks: true },
      });
    
      if (!existingTask) throw new Error('Task not found');
    
      const existingTasks = existingTask.tasks;
    
      // Map existing columns by ID
      const existingTaskMap = new Map(existingTasks.map(sub => [sub.id, sub]));
    
      // Incoming columns split by type
      const incomingSubTasksWithId = data.sub_tasks.filter(sub => sub.id);       // Update
      const incomingSubTasksWithoutId = data.sub_tasks.filter(sub => !sub.id);   // Create
    
      const incomingIds = new Set(incomingSubTasksWithId?.map(sub => sub.id));
      const SubTasksToDelete = existingTasks.filter(sub => !incomingIds.has(sub.id));
    
      const operations: Prisma.PrismaPromise<any>[] = [];
    
      // Update task title
      operations.push(
        this.prisma.tasks.update({
          where: { id },
          data: { title: data.title ,description:data.description,status_id:data.status_id},
        })
      );
    
      // Update existing columns
      for (const sub of incomingSubTasksWithId) {
        operations.push(
          this.prisma.sub_tasks.update({
            where: { id: sub.id },
            data: { title: sub.title },
          })
        );
      }
    
      // Create new columns
      for (const sub of incomingSubTasksWithoutId) {
        operations.push(
          this.prisma.sub_tasks.create({
            data: {
              title: sub.title,
              task_id: id,
            },
          })
        );
      }
    
      // Delete removed columns
      for (const sub of SubTasksToDelete) {
        operations.push(
          this.prisma.sub_tasks.delete({
            where: { id: sub.id },
          })
        );
      }
    
      await this.prisma.$transaction(operations);
    
      return this.prisma.tasks.findUnique({
        where: { id },
        include: { tasks: true },
      });
    }
    
    async deleteTask(id:number): Promise<Task>{
        return this.prisma.tasks.delete({
                where:{id},
            })
    }

    // column status
    async changeTaskStatus(id:number,data:TaskStatusDto): Promise<Task>{
            return this.prisma.tasks.update({
                    where:{id},
                    data:data
                })
    }

}
