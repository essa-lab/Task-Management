import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { BoardService } from './boards.service';
import { ResponseBody } from 'src/common/response-body';
import { Boards } from './boards.model';
import { boardDto } from './dto/board.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';


@Controller('/api/boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}
  @Get()
  @ApiOperation({ summary: 'Get all boards' })
  @ApiResponse({ status: 200, description: 'Board List' })
  async findAll(): Promise<ResponseBody<Boards[]>> {
    const boards = await this.boardService.getAllBoards();
    return new ResponseBody(true,  'Boards retrieved successfully',boards);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get board by ID' })
  @ApiResponse({ status: 200, description: 'Board Object with its related objects' })
  async findOne(@Param('id',ParseIntPipe) id: number): Promise<ResponseBody<Boards>> {
    const boards = await this.boardService.getBoard(id);
    return new ResponseBody(true,  'Board retrieved successfully',boards);
  }

  @Post()
  @ApiOperation({ summary: 'Create Board with columns' })
  @ApiResponse({ status: 200, description: 'New Board Object' })
  async create(@Body() boardDto:boardDto): Promise<ResponseBody<Boards>> {
    const boards = await this.boardService.createBoard(boardDto);
    return new ResponseBody(true,  'Board Created successfully',boards);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Board and delete, update , create related Columns on the board' })
  @ApiResponse({ status: 200, description: 'Updated Board Object' })
  async update(@Param('id',ParseIntPipe) id: number , @Body() boardDto: boardDto): Promise<ResponseBody<Boards>> {
    const boards = await this.boardService.updateBoard(id, boardDto);
    return new ResponseBody(true,  'Board Updated successfully',boards);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Board' })
  @ApiResponse({ status: 200, description: 'Deleted Board Object with all realted objects' })
  async delete(@Param('id',ParseIntPipe) id: number): Promise<ResponseBody<Boards>> {
    const boards = await this.boardService.deleteBoard(id);
    return new ResponseBody(true,  'Board Deleted successfully',boards);
  }

}
