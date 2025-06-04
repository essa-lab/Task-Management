import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, ValidationPipe } from '@nestjs/common';
import { ErrorBody, ResponseBody } from 'src/common/response-body';
import { SubTask } from './sub_tasks.model';
import { SubTaskService } from './sub_tasks.service';
import { TaskExistDto } from '../dto/task_exist.dto';
import { SubTaskDto } from '../dto/sub_tasks.dto';
import { SubTaskStatusDto } from '../dto/sub_tasks_status.dto';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('/api')
export class SubTaskController {
  constructor(private readonly subTaskService: SubTaskService) {}

  @Get('sub-tasks')
  @ApiOperation({ summary: 'Get All SubTasks' })
  @ApiResponse({ status: 200, description: 'SubTask List' ,type:ResponseBody})
  async findAll(): Promise<ResponseBody<SubTask[]>> {
    const subTasks = await this.subTaskService.getAllSubTasks();
    return new ResponseBody(true,  'Sub Tasks retrieved successfully',subTasks);
  }

  @Get('sub-tasks/:id')
    @ApiOperation({ summary: 'Get Task By ID' })
    @ApiResponse({ status: 200, description: 'Sub Task Object', type: ResponseBody })
    @ApiResponse({
      status: 404,
      description: 'Task with ID not found',
      type: ErrorBody,
    })
  async findOne(@Param('id',ParseIntPipe) id: number): Promise<ResponseBody<SubTask>> {
    const subTasks = await this.subTaskService.getSubTask(id);
    return new ResponseBody(true,  'Sub Task retrieved successfully',subTasks);
  }

  @Post('tasks/:taskId/sub-tasks')
  @ApiOperation({ summary: 'Create Sub Task' })
  @ApiResponse({
    status: 200,
    description: 'New Sub Task Object',
    type: ResponseBody,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request Error',
    type: ErrorBody,
  })
  @ApiResponse({ status: 404, description: 'Not Found Error', type: ErrorBody })
  async create(@Param(new ValidationPipe({ transform: true })) params: TaskExistDto,
              @Body() subTaskDto:SubTaskDto): Promise<ResponseBody<SubTask>> {
    const {taskId} = params
    const task = await this.subTaskService.createSubTaskOnTask(taskId,subTaskDto);
    return new ResponseBody(true,  'Sub Task Created successfully',task);
  }

  @Put('sub-tasks/:id')
  @ApiOperation({
    summary: 'Update SubTask',
  })
  @ApiOperation({ summary: 'Update SubTask' })
  @ApiResponse({
    status: 200,
    description: 'Updated Task Object',
    type: ResponseBody,
  })
  @ApiResponse({
    status: 404,
    description: 'SubTask with ID not found',
    type: ErrorBody,
  })
  async update(@Param('id',ParseIntPipe) id: number , @Body() subTaskDto: SubTaskDto): Promise<ResponseBody<SubTask>> {
    const task = await this.subTaskService.updateSubTask(id, subTaskDto);
    return new ResponseBody(true,  'Sub Task Updated successfully',task);
  }

  @Put('sub-tasks-status/:id')
  @ApiOperation({ summary: 'Mark a SubTask as Done/Not Done' })
    @ApiResponse({ status: 200, description: 'Updated SubTask Object' ,type:ResponseBody})
    @ApiResponse({
    status: 404,
    description: 'SubTask with ID not found',
    type: ErrorBody,
  })
  async updateStatus(@Param('id',ParseIntPipe) id: number , @Body() subTaskStatusDto: SubTaskStatusDto): Promise<ResponseBody<SubTask>> {

    const task = await this.subTaskService.changeSubTaskStatus(id, subTaskStatusDto);
    return new ResponseBody(true,  'Sub Task Updated successfully',task);
  }

  @Delete('sub-tasks/:id')
  @ApiOperation({ summary: 'Delete SubTask' })
    @ApiResponse({ status: 200, description: 'Deleted SubTask Object' ,type:ResponseBody})
    @ApiResponse({
    status: 404,
    description: 'SubTask with ID not found',
    type: ErrorBody,
  })
  async delete(@Param('id',ParseIntPipe) id: number): Promise<ResponseBody<SubTask>> {
    const task = await this.subTaskService.deleteSubTask(id);
    return new ResponseBody(true,  'Sub Task Deleted successfully',task);
  }

}
