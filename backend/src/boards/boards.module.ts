import { Module } from '@nestjs/common';
import { BoardService } from './boards.service';
import { BoardController } from './boards.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [BoardController],
  providers: [BoardService, PrismaService],
})
export class BoardModule {}
