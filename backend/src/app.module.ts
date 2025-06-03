import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardModule } from './boards/boards.module';
import { ColumnModule } from './columns/columns.module';
import { TaskModule } from './tasks/tasks.module';

@Module({
  imports: [BoardModule,ColumnModule,TaskModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
