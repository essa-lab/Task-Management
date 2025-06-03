import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { Validate } from 'class-validator';
import { BoardExist } from 'src/common/validator/board_exist.validator';

export class BoardExsistDTO {
  @Type(() => Number)
  @IsInt()
  @Validate(BoardExist)
  boardId: number;
}
