import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { BoardExist } from 'src/common/validator/board_exist.validator';
import { ColumnController } from './columns.controller';
import { ColumnService } from './columns.service';
import { ColumnExist } from 'src/common/validator/column_exist.validator';

@Module({
  controllers: [ColumnController],
  providers: [ PrismaService,ColumnService,BoardExist,ColumnExist],
})
export class ColumnModule {}
