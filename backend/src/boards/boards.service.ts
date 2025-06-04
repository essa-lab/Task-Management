import { Injectable } from '@nestjs/common';
import { Boards } from './boards.model';
import { PrismaService } from 'prisma/prisma.service';
import { boardDto } from './dto/board.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class BoardService {
    constructor(private prisma: PrismaService) {}

    async getAllBoards(): Promise<Boards[]> {
        return this.prisma.boards.findMany({include:{
          columns:true
        }});
    }

    async getBoard(id:number): Promise<any> {
        const board = await this.prisma.boards.findUniqueOrThrow({where:{id}
        ,include:{
            columns:{
                include:{
                    tasks:{
                        include:{
                            tasks:true
                        }
                    }
                }
            }
        }
        });

  // Add doneCount and totalCount to each column
  const columnsWithTaskStats = board.columns.map((column) => {
  const enhancedTasks = column.tasks.map((task) => {
    const totalSubTasks = task.tasks?.length || 0;
    const doneSubTasks = task.tasks?.filter(st => st.is_done === true).length || 0;

    return {
      ...task,
      totalSubTasks,
      doneSubTasks,
    };
  });

  return {
    ...column,
    tasks: enhancedTasks,
  };
});


  return {
    ...board,
    columns: columnsWithTaskStats,
  };
    }

    async createBoard(data: boardDto): Promise<any> {
  return this.prisma.boards.create({
    data: {
      title: data.title,
      columns: {
      create: data.columns.map(col => ({ title: col.title })),
      },
    },
    include: {
      columns: true,
    },
  });
}

   async updateBoard(id: number, data: { title: string; columns: { id?: number; title: string }[] }): Promise<any> {
  const existingBoard = await this.prisma.boards.findUniqueOrThrow({
    where: { id },
    include: { columns: true },
  });

  if (!existingBoard) throw new Error('Board not found');

  const existingColumns = existingBoard.columns;

  // Map existing columns by ID
  const existingColumnMap = new Map(existingColumns.map(col => [col.id, col]));

  // Incoming columns split by type
  const incomingColumnsWithId = data.columns.filter(col => col.id);       // Update
  const incomingColumnsWithoutId = data.columns.filter(col => !col.id);   // Create

  const incomingIds = new Set(incomingColumnsWithId.map(col => col.id));
  const columnsToDelete = existingColumns.filter(col => !incomingIds.has(col.id));

  const operations: Prisma.PrismaPromise<any>[] = [];

  // Update board title
  operations.push(
    this.prisma.boards.update({
      where: { id },
      data: { title: data.title },
    })
  );

  // Update existing columns
  for (const col of incomingColumnsWithId) {
    operations.push(
      this.prisma.columns.update({
        where: { id: col.id },
        data: { title: col.title },
      })
    );
  }

  // Create new columns
  for (const col of incomingColumnsWithoutId) {
    operations.push(
      this.prisma.columns.create({
        data: {
          title: col.title,
          board_id: id,
        },
      })
    );
  }

  // Delete removed columns
  for (const col of columnsToDelete) {
    operations.push(
      this.prisma.columns.delete({
        where: { id: col.id },
      })
    );
  }

  await this.prisma.$transaction(operations);

  return this.prisma.boards.findUnique({
    where: { id },
    include: { columns: true },
  });
}



    async deleteBoard(id:number): Promise<Boards>{
        await this.prisma.boards.delete({
                where:{id},
        })
        return this.prisma.boards.findFirstOrThrow({include:{
            columns:{
                include:{
                    tasks:{
                        include:{
                            tasks:true
                        }
                    }
                }
            }
        }});
    }

    

}
