import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean } from "class-validator";

export class SubTaskStatusDto{


    @IsBoolean()
    @ApiProperty({ example: [0,1,false,true] ,default:false})
    is_done : boolean=false;

  

}