import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, Length, validate, Validate } from "class-validator";

export class TaskStatusDto{

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ example: 1 ,required:true})
    status_id : number;


}