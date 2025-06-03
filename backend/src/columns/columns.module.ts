import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { BoardExist } from 'src/common/validator/board_exist.validator';
import { ColumnController } from './columns.controller';
import { ColumnService } from './columns.service';

@Module({
  controllers: [ColumnController],
  providers: [ PrismaService,ColumnService,BoardExist],
})
export class ColumnModule {}
