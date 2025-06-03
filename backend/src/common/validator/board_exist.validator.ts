import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class BoardExist implements ValidatorConstraintInterface {
  constructor(private prisma: PrismaService) {
    
  }

  async validate(boardId: number): Promise<boolean> {
  const board = await this.prisma.boards.findUnique({
    where: { id: boardId },
  });

  return !!board;
}

  defaultMessage(args: ValidationArguments): string {
    return `Board with id ${args.value} does not exist`;
  }
}
