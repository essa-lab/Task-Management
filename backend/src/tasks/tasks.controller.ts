import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { ErrorBody, ResponseBody } from 'src/common/response-body';
import { Task } from './tasks.model';
import { TaskDto } from './dto/tasks.dto';
import { TaskService } from './tasks.service';
import { TaskStatusDto } from './dto/tasks_status.dto';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { TaskExistDto } from './dto/task_exist.dto';

@Controller('/api')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('tasks')
  @ApiOperation({ summary: 'Get all Tasks' })
  @ApiResponse({ status: 200, description: 'Tasks List', type: ResponseBody })
  async findAll(): Promise<ResponseBody<Task[]>> {
    const tasks = await this.taskService.getAllTasks();
    return new ResponseBody(true, 'Tasks retrieved successfully', tasks);
  }

  @Get('tasks/:taskId')
  @ApiParam({
    name: 'taskId',
    required: true,
    description: 'The ID of the Task',
    type: Number,
  })
  @ApiOperation({ summary: 'Get Task By ID' })
  @ApiResponse({ status: 200, description: 'Task Object', type: ResponseBody })
  @ApiResponse({
    status: 400,
    description: 'Task with ID not found',
    type: ErrorBody,
  })
  async findOne(
    @Param(new ValidationPipe({ transform: true })) params: TaskExistDto,
  ): Promise<ResponseBody<Task>> {
    const { taskId } = params;
    const tasks = await this.taskService.getTask(taskId);
    return new ResponseBody(true, 'Task retrieved successfully', tasks);
  }

  @Post('tasks')
  @ApiOperation({ summary: 'Create Task' })
  @ApiResponse({
    status: 200,
    description: 'New Task Object',
    type: ResponseBody,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request Error',
    type: ErrorBody,
  })
  @ApiResponse({ status: 404, description: 'Not Found Error', type: ErrorBody })
  async create(@Body() TaskDto: TaskDto): Promise<ResponseBody<Task>> {
    const task = await this.taskService.createTask(TaskDto);
    return new ResponseBody(true, 'Task Created successfully', task);
  }

  @Put('tasks/:taskId')
  @ApiOperation({
    summary: 'Update Task and delete, create, updated subTasks on it.',
  })
  @ApiParam({
    name: 'taskId',
    required: true,
    description: 'The ID of the Task',
    type: Number,
  })
  @ApiOperation({ summary: 'Update Task' })
  @ApiResponse({
    status: 200,
    description: 'Updated Task Object',
    type: ResponseBody,
  })
  @ApiResponse({
    status: 400,
    description: 'Task with ID not found',
    type: ErrorBody,
  })
  async update(
    @Param(new ValidationPipe({ transform: true })) params: TaskExistDto,
    @Body() taskDto: TaskDto,
  ): Promise<ResponseBody<Task>> {
    const { taskId } = params;
    const task = await this.taskService.updateTask(taskId, taskDto);
    return new ResponseBody(true, 'Task Updated successfully', task);
  }

  @Put('tasks-status/:taskId')
  @ApiParam({
    name: 'taskId',
    required: true,
    description: 'The ID of the Task',
    type: Number,
  })
  @ApiOperation({ summary: 'Change status/column for Task' })
  @ApiResponse({
    status: 200,
    description: 'Updated Task Object',
    type: ResponseBody,
  })
  @ApiResponse({
    status: 400,
    description: 'Task with ID not found',
    type: ErrorBody,
  })
  async updateStatus(
    @Param(new ValidationPipe({ transform: true })) params: TaskExistDto,
    @Body() taskStatusDto: TaskStatusDto,
  ): Promise<ResponseBody<Task>> {
    const { taskId } = params;
    const task = await this.taskService.changeTaskStatus(taskId, taskStatusDto);
    return new ResponseBody(true, 'Task Updated successfully', task);
  }

  @Delete('tasks/:taskId')
  @ApiParam({
    name: 'taskId',
    required: true,
    description: 'The ID of the Task',
    type: Number,
  })
  @ApiOperation({ summary: 'Delete Task' })
  @ApiResponse({
    status: 200,
    description: 'Deleted Task Object',
    type: ResponseBody,
  })
  @ApiResponse({ status: 400, description: 'Bad Request', type: ErrorBody })
  async delete(
    @Param(new ValidationPipe({ transform: true })) params: TaskExistDto,
  ): Promise<ResponseBody<Task>> {
    const { taskId } = params;
    const task = await this.taskService.deleteTask(taskId);
    return new ResponseBody(true, 'Task Deleted successfully', task);
  }
}
