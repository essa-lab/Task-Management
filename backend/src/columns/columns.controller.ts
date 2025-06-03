import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, ValidationPipe } from '@nestjs/common';
import { ResponseBody } from 'src/common/response-body';
import { ColumnService } from './columns.service';
import { Column } from './columns.model';
import {  BoardExsistDTO } from './dto/board_exsist.dto';
import { columnDto } from './dto/columns.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('/api')
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  @Get('columns')
  @ApiOperation({ summary: 'Get all Columns' })
  @ApiResponse({ status: 200, description: 'Columns List' })
  async findAll(): Promise<ResponseBody<Column[]>> {
    const columns = await this.columnService.getAllColumns();
    return new ResponseBody(true,  'Columns retrieved successfully',columns);
  }

  @Get('columns/:id')
  @ApiOperation({ summary: 'Get Columns By ID' })
  @ApiResponse({ status: 200, description: 'Columns List' })
  async findOne(@Param('id',ParseIntPipe) id: number): Promise<ResponseBody<Column>> {
    const columns = await this.columnService.getColumn(id);
    return new ResponseBody(true,  'Column retrieved successfully',columns);
  }

  @Post('boards/:boardId/columns')
  @ApiOperation({ summary: 'Create Columns on Board' })
  @ApiResponse({ status: 200, description: 'New Columns Object' })
  async create(@Param(new ValidationPipe({ transform: true })) params: BoardExsistDTO,
              @Body() columnDto:columnDto): Promise<ResponseBody<Column>> {
    const {boardId} = params
    const column = await this.columnService.createColumnOnBoard(boardId,columnDto);
    return new ResponseBody(true,  'Column Created successfully',column);
  }

  @Put('columns/:id')
  @ApiOperation({ summary: 'Update Columns by ID' })
  @ApiResponse({ status: 200, description: 'Updated Columns Object' })
  async update(@Param('id',ParseIntPipe) id: number , @Body() columnDto: columnDto): Promise<ResponseBody<Column>> {
    const column = await this.columnService.updateColumn(id, columnDto);
    return new ResponseBody(true,  'Column Updated successfully',column);
  }

  @Delete('column/:id')
  @ApiOperation({ summary: 'Delete Columns by ID' })
  @ApiResponse({ status: 200, description: 'Deleted Columns Object' })
  async delete(@Param('id',ParseIntPipe) id: number): Promise<ResponseBody<Column>> {
    const column = await this.columnService.deleteColumn(id);
    return new ResponseBody(true,  'Column Deleted successfully',column);
  }

}
