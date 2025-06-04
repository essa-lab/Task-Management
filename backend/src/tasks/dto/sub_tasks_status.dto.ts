import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean } from "class-validator";

export class SubTaskStatusDto{


    @IsBoolean()
    @ApiProperty({ example: true ,default:false})
    is_done : boolean=false;

  

}