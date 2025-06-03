import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Length, Validate } from "class-validator";

export class columnDto{

    @IsString()
    @IsNotEmpty()
    @Length(2,25)
    @ApiProperty({ example: 'TO-DO' })
    title : string;

    @IsOptional()
    @ApiProperty({ example: 9999,  required: false })
    id :number;
}