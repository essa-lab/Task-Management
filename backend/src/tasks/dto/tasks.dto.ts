import { IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Length, validate, Validate } from "class-validator";
import { ColumnExist } from "src/common/validator/column_exist.validator";
import { SubTaskDto } from "./sub_tasks.dto";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class TaskDto{

    @IsString()
    @IsNotEmpty()
    @Length(2,25)
    @ApiProperty({ example: 'Board Component' ,required:true})
    title : string;

    @IsString()
    @IsNotEmpty()
    @Length(10,255)
    @ApiProperty({ example: 'List of Board Component progress points' ,required:true})
    description : string;

    @IsArray()
    @IsOptional()
    @Type(() => SubTaskDto)
      @ApiProperty({
        type: [SubTaskDto],
        required: false,
        description: 'List of Sub Tasks',
      })
    sub_tasks : SubTaskDto[]

    @Type(() => Number)
    @IsInt()
    @IsOptional()
    @Validate(ColumnExist)
    @ApiProperty({ example: 1 ,required:false})
    status_id : number

}