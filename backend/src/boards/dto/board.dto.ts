import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,

} from 'class-validator';
import { columnDto } from 'src/columns/dto/columns.dto';

export class boardDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 25)
  @ApiProperty({ example: 'To-Do Assessment' })
  title: string;

  @IsArray()
  @IsOptional()
  @Type(() => columnDto)
  @ApiProperty({
    type: [columnDto],
    required: false,
    description: 'List of columns',
  })
  columns: columnDto[];
}
