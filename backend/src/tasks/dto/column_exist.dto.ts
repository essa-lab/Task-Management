import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { Validate } from 'class-validator';
import { ColumnExist } from 'src/common/validator/column_exist.validator';
import { ApiProperty } from '@nestjs/swagger';

export class ColumnExistDto {
  @Type(() => Number)
  @IsInt()
  @Validate(ColumnExist)
  @ApiProperty({ example: 1 ,required:true})
  columnId: number;
}
