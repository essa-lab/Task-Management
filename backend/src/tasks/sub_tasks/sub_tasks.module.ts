import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { SubTaskService } from './sub_tasks.service';
import { SubTaskController } from './sub_tasks.controller';

@Module({
  controllers: [SubTaskController],
  providers: [ PrismaService,SubTaskService],
})
export class SubTaskModule {}
