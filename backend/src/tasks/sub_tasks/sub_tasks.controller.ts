import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, ValidationPipe } from '@nestjs/common';
import { ResponseBody } from 'src/common/response-body';
import { SubTask } from './sub_tasks.model';
import { SubTaskService } from './sub_tasks.service';
import { TaskExistDto } from '../dto/task_exist.dto';
import { SubTaskDto } from '../dto/sub_tasks.dto';
import { SubTaskStatusDto } from '../dto/sub_tasks_status.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('/api')
export class SubTaskController {
  constructor(private readonly subTaskService: SubTaskService) {}

  @Get('sub-tasks')
  @ApiOperation({ summary: 'Get All SubTasks' })
    @ApiResponse({ status: 200, description: 'SubTask List' })
  async findAll(): Promise<ResponseBody<SubTask[]>> {
    const subTasks = await this.subTaskService.getAllSubTasks();
    return new ResponseBody(true,  'Sub Tasks retrieved successfully',subTasks);
  }

  @Get('sub-tasks/:id')
  @ApiOperation({ summary: 'Get SubTask By ID' })
    @ApiResponse({ status: 200, description: 'SubTask Object' })
  async findOne(@Param('id',ParseIntPipe) id: number): Promise<ResponseBody<SubTask>> {
    const subTasks = await this.subTaskService.getSubTask(id);
    return new ResponseBody(true,  'Sub Task retrieved successfully',subTasks);
  }

  @Post('tasks/:taskId/sub-tasks')
  @ApiOperation({ summary: 'Craete SubTask on Task' })
    @ApiResponse({ status: 200, description: 'New SubTask Object' })
  async create(@Param(new ValidationPipe({ transform: true })) params: TaskExistDto,
              @Body() subTaskDto:SubTaskDto): Promise<ResponseBody<SubTask>> {
    const {taskId} = params
    const task = await this.subTaskService.createSubTaskOnTask(taskId,subTaskDto);
    return new ResponseBody(true,  'Sub Task Created successfully',task);
  }

  @Put('sub-tasks/:id')
  @ApiOperation({ summary: 'Update SubTask' })
    @ApiResponse({ status: 200, description: 'Update SubTask Object' })
  async update(@Param('id',ParseIntPipe) id: number , @Body() subTaskDto: SubTaskDto): Promise<ResponseBody<SubTask>> {
    const task = await this.subTaskService.updateSubTask(id, subTaskDto);
    return new ResponseBody(true,  'Sub Task Updated successfully',task);
  }

  @Put('sub-tasks-status/:id')
  @ApiOperation({ summary: 'Mark a SubTask as Done/Not Done' })
    @ApiResponse({ status: 200, description: 'Updated SubTask Object' })
  async updateStatus(@Param('id',ParseIntPipe) id: number , @Body() subTaskStatusDto: SubTaskStatusDto): Promise<ResponseBody<SubTask>> {

    const task = await this.subTaskService.changeSubTaskStatus(id, subTaskStatusDto);
    return new ResponseBody(true,  'Sub Task Updated successfully',task);
  }

  @Delete('tasks/:id')
  @ApiOperation({ summary: 'Delete SubTask' })
    @ApiResponse({ status: 200, description: 'Deleted SubTask Object' })
  async delete(@Param('id',ParseIntPipe) id: number): Promise<ResponseBody<SubTask>> {
    const task = await this.subTaskService.deleteSubTask(id);
    return new ResponseBody(true,  'Sub Task Deleted successfully',task);
  }

}
