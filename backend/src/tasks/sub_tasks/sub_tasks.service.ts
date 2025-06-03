import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { SubTask } from './sub_tasks.model';
import { SubTaskDto } from '../dto/sub_tasks.dto';
import { SubTaskStatusDto } from '../dto/sub_tasks_status.dto';

@Injectable()
export class SubTaskService {
    constructor(private prisma: PrismaService) {}

    async getAllSubTasks(): Promise<SubTask[]> {
        return this.prisma.sub_tasks.findMany();
    }

    async getSubTask(id:number): Promise<SubTask> {
        return this.prisma.sub_tasks.findUniqueOrThrow({where:{id}});
    }

    async createSubTaskOnTask(taskId: number, dto: SubTaskDto) {
    return this.prisma.sub_tasks.create({
      data: {
        title: dto.title,
        is_done: dto.is_done,
        task: {
          connect: { id: taskId },
        },
      },
    }); 
}

    async updateSubTask(id:number,data:SubTaskDto): Promise<SubTask>{
        return this.prisma.sub_tasks.update({
                where:{id},
                data:data
            })
    }
    // done , not done status
    async changeSubTaskStatus(id:number,data:SubTaskStatusDto): Promise<SubTask>{
      
        return this.prisma.sub_tasks.update({
                where:{id},
                data:data
            })
    }

    async deleteSubTask(id:number): Promise<SubTask>{
        return this.prisma.sub_tasks.delete({
                where:{id},
            })
    }

}
