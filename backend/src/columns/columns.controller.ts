import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, ValidationPipe } from '@nestjs/common';
import { ErrorBody, ResponseBody } from 'src/common/response-body';
import { ColumnService } from './columns.service';
import { Column } from './columns.model';
import {  BoardExsistDTO } from './dto/board_exsist.dto';
import { columnDto } from './dto/columns.dto';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ColumnExistDto } from 'src/tasks/dto/column_exist.dto';

@Controller('/api')
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  @Get('columns')
  @ApiOperation({ summary: 'Get all Columns' })
  @ApiResponse({ status: 200, description: 'Columns List' ,type:ResponseBody})
  async findAll(): Promise<ResponseBody<Column[]>> {
    const columns = await this.columnService.getAllColumns();
    return new ResponseBody(true,  'Columns retrieved successfully',columns);
  }

  @Get('columns/:columnId')
  @ApiParam({
    name: 'columnId',
    required: true,
    description: 'The ID of the board',
    type: Number,
  })
  @ApiOperation({ summary: 'Get Columns By ID' })
  @ApiResponse({ status: 200, description: 'Columns Object' })
  @ApiResponse({ status: 400, description: 'Column with ID not found',type:ErrorBody })
  async findOne(@Param(new ValidationPipe({ transform: true })) params: ColumnExistDto): Promise<ResponseBody<Column>> {
    const {columnId} = params
    const columns = await this.columnService.getColumn(columnId);
    return new ResponseBody(true,  'Column retrieved successfully',columns);
  }

  @Post('boards/:boardId/columns')
  @ApiParam({
  name: 'boardId',
  required: true,
  description: 'The ID of the board',
  type: Number,
})
  @ApiOperation({ summary: 'Create Columns on Board' })
  @ApiResponse({ status: 200, description: 'New Column Object' ,type:ResponseBody})
  @ApiResponse({ status: 400, description: 'Bad Request Error',type:ErrorBody })  
  @ApiResponse({ status: 404, description: 'Not Found Error',type:ErrorBody })  
  async create(@Param(new ValidationPipe({ transform: true })) params: BoardExsistDTO,
              @Body() columnDto:columnDto): Promise<ResponseBody<Column>> {
    const {boardId} = params
    const column = await this.columnService.createColumnOnBoard(boardId,columnDto);
    return new ResponseBody(true,  'Column Created successfully',column);
  }

  @Put('columns/:columnId')
   @ApiParam({
  name: 'columnId',
  required: true,
  description: 'The ID of the Column',
  type: Number,
})
  @ApiOperation({ summary: 'Update Columns on Board' })
  @ApiResponse({ status: 200, description: 'New Column Object' ,type:ResponseBody})
  @ApiResponse({ status: 400, description: 'Bad Request Error',type:ErrorBody })  
  @ApiResponse({ status: 404, description: 'Not Found Error',type:ErrorBody })  
  async update(@Param(new ValidationPipe({ transform: true })) params: ColumnExistDto,
   @Body() columnDto: columnDto): Promise<ResponseBody<Column>> {
    const {columnId} = params
    const column = await this.columnService.updateColumn(columnId, columnDto);
    return new ResponseBody(true,  'Column Updated successfully',column);
  }

  @Delete('columns/:columnId')
     @ApiParam({
      name: 'columnId',
      required: true,
      description: 'The ID of the column',
      type: Number,
    })
    @ApiOperation({ summary: 'Delete Column' })
    @ApiResponse({ status: 200, description: 'Deleted Column Object' ,type:ResponseBody})
    @ApiResponse({ status: 400, description: 'Bad Request',type:ErrorBody })
    async delete(@Param(new ValidationPipe({ transform: true })) params: ColumnExistDto): Promise<ResponseBody<Column>> {
      const {columnId} = params
    const column = await this.columnService.deleteColumn(columnId);
    return new ResponseBody(true,  'Column Deleted successfully',column);
  }

}
