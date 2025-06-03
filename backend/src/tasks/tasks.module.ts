import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { TaskService } from './tasks.service';
import { TaskController } from './tasks.controller';
import { SubTaskModule } from './sub_tasks/sub_tasks.module';
import { ColumnExist } from 'src/common/validator/column_exist.validator';

@Module({
  imports:[SubTaskModule],
  controllers: [TaskController],
  providers: [ PrismaService,TaskService,ColumnExist],
})
export class TaskModule {}
