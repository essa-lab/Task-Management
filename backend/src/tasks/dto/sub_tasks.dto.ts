import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from "class-validator";

export class SubTaskDto{

    @IsString()
    @IsNotEmpty()
    @Length(2,25)
    @ApiProperty({ example: 'Fix Header UI' }) 
    title : string;

    @IsBoolean()
    @ApiProperty({ example: [0,1,false,true] ,default:false})
    is_done : boolean=false;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ example: 5 ,required:false})
    id : number

}