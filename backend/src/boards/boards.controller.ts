import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, ValidationPipe } from '@nestjs/common';
import { BoardService } from './boards.service';
import { ErrorBody, ResponseBody } from 'src/common/response-body';
import { Boards } from './boards.model';
import { boardDto } from './dto/board.dto';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { BoardExsistDTO } from 'src/columns/dto/board_exsist.dto';


@Controller('/api/boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}
  @Get()
  @ApiOperation({ summary: 'Get all boards' })
  @ApiResponse({ status: 200, description: 'Board List' ,type:ResponseBody })
  async findAll(): Promise<ResponseBody<Boards[]>> {
    const boards = await this.boardService.getAllBoards();
    return new ResponseBody(true,  'Boards retrieved successfully',boards);
  }

  @Get(':boardId')
  @ApiParam({
    name: 'boardId',
    required: true,
    description: 'The ID of the board',
    type: Number,
  })
  @ApiOperation({ summary: 'Get board by ID' })
  @ApiResponse({ status: 200, description: 'Board Object with its related objects',type:ResponseBody })
  @ApiResponse({ status: 404, description: 'Board with ID not found',type:ErrorBody })
  async findOne(@Param(new ValidationPipe({ transform: true })) params: BoardExsistDTO): Promise<ResponseBody<Boards>> {
    const {boardId} = params
    const boards = await this.boardService.getBoard(boardId);
    return new ResponseBody(true,  'Board retrieved successfully',boards);
  }

  @Post()
  @ApiOperation({ summary: 'Create Board with columns' })
  @ApiResponse({ status: 200, description: 'New Board Object' ,type:ResponseBody})
  @ApiResponse({ status: 400, description: 'Bad Request Error',type:ErrorBody })
  async create(@Body() boardDto:boardDto): Promise<ResponseBody<Boards>> {
    const boards = await this.boardService.createBoard(boardDto);
    return new ResponseBody(true,  'Board Created successfully',boards);
  }

  @Put(':boardId')
  @ApiParam({
    name: 'boardId',
    required: true,
    description: 'The ID of the board',
    type: Number,
  })
  @ApiOperation({ summary: 'Update Board and delete, update , create related Columns on the board' })
  @ApiResponse({ status: 200, description: 'Updated Board Object' ,type:ResponseBody})
  @ApiResponse({ status: 400, description: 'Bad Request Error',type:ErrorBody })
  @ApiResponse({ status: 404, description: 'Not Found Error',type:ErrorBody })  
  async update(@Param(new ValidationPipe({ transform: true })) params: BoardExsistDTO, 
  @Body() boardDto: boardDto): Promise<ResponseBody<Boards>> {
    const {boardId} = params
    const boards = await this.boardService.updateBoard(boardId, boardDto);
    return new ResponseBody(true,  'Board Updated successfully',boards);
  }

  @Delete(':boardId')
   @ApiParam({
    name: 'boardId',
    required: true,
    description: 'The ID of the board',
    type: Number,
  })
  @ApiOperation({ summary: 'Delete Board' })
  @ApiResponse({ status: 200, description: 'First Found Board Object With all realted objects' ,type:ResponseBody})
  @ApiResponse({ status: 400, description: 'Bad Request',type:ErrorBody })
  async delete(@Param(new ValidationPipe({ transform: true })) params: BoardExsistDTO): Promise<ResponseBody<Boards>> {
    const {boardId} = params
    const boards = await this.boardService.deleteBoard(boardId);
    return new ResponseBody(true,  'Board Deleted successfully',boards);
  }

}
