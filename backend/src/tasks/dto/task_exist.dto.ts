import { IsInt, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { Validate } from 'class-validator';
import { TaskExist } from 'src/common/validator/task_exist.validator';
import { ApiProperty } from '@nestjs/swagger';

export class TaskExistDto {
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  @Validate(TaskExist)
  @ApiProperty({ example: 1 ,required:true})
  taskId: number;
}
