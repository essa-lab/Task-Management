import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, ValidationPipe } from '@nestjs/common';
import { ResponseBody } from 'src/common/response-body';
import { Task } from './tasks.model';
import { TaskDto } from './dto/tasks.dto';
import { TaskService } from './tasks.service';
import { TaskStatusDto } from './dto/tasks_status.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('/api')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('tasks')
  @ApiOperation({ summary: 'Get All Tasks' })
  @ApiResponse({ status: 200, description: 'Tasks List.' })
  async findAll(): Promise<ResponseBody<Task[]>> {
    const tasks = await this.taskService.getAllTasks();
    return new ResponseBody(true,  'Tasks retrieved successfully',tasks);
  }

  @Get('tasks/:id')
  @ApiOperation({ summary: 'Get Tasks By ID' })
  @ApiResponse({ status: 200, description: 'Task Object' })
  async findOne(@Param('id',ParseIntPipe) id: number): Promise<ResponseBody<Task>> {
    const tasks = await this.taskService.getTask(id);
    return new ResponseBody(true,  'Task retrieved successfully',tasks);
  }

  @Post('tasks')
  @ApiOperation({ summary: 'Create Task' })
  @ApiResponse({ status: 200, description: 'New Task Object' })
  async create( @Body() TaskDto:TaskDto): Promise<ResponseBody<Task>> {


    const task = await this.taskService.createTask(TaskDto);
    return new ResponseBody(true,  'Task Created successfully',task);
  }

  @Put('tasks/:id')
  @ApiOperation({ summary: 'Update Task and delete, create, updated subTasks on it.' })
  @ApiResponse({ status: 200, description: 'Updated Task Object' })
  async update(@Param('id',ParseIntPipe) id: number , @Body() taskDto: TaskDto): Promise<ResponseBody<Task>> {
    const task = await this.taskService.updateTask(id, taskDto);
    return new ResponseBody(true,  'Task Updated successfully',task);
  }

   @Put('tasks-status/:id')
   @ApiOperation({ summary: 'Change status/column for Task' })
  @ApiResponse({ status: 200, description: 'Task Object' })
  async updateStatus(@Param('id',ParseIntPipe) id: number , @Body() taskStatusDto: TaskStatusDto): Promise<ResponseBody<Task>> {
    const task = await this.taskService.changeTaskStatus(id, taskStatusDto);
    return new ResponseBody(true,  'Task Updated successfully',task);
  }

  @Delete('tasks/:id')
  @ApiOperation({ summary: 'Delete Task' })
  @ApiResponse({ status: 200, description: 'Deleted Task Object' })
  async delete(@Param('id',ParseIntPipe) id: number): Promise<ResponseBody<Task>> {
    const task = await this.taskService.deleteTask(id);
    return new ResponseBody(true,  'Task Deleted successfully',task);
  }

}
