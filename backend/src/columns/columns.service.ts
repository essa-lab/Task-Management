import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Column } from './columns.model';
import { columnDto } from './dto/columns.dto';

@Injectable()
export class ColumnService {
    constructor(private prisma: PrismaService) {}

    async getAllColumns(): Promise<Column[]> {
        return this.prisma.columns.findMany();
    }

    async getColumn(id:number): Promise<Column> {
        return this.prisma.columns.findUniqueOrThrow({where:{id}});
    }

     async createColumnOnBoard(boardId: number, dto: columnDto) {
    return this.prisma.columns.create({
      data: {
        title: dto.title,
        board: {
          connect: { id: boardId },
        },
      },
    }); 
}

    async updateColumn(id:number,data:columnDto): Promise<Column>{
        return this.prisma.columns.update({
                where:{id},
                data:data
            })
    }

    async deleteColumn(id:number): Promise<Column>{
        return this.prisma.columns.delete({
                where:{id},
            })
    }

}
