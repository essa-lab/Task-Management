import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class ColumnExist implements ValidatorConstraintInterface {
  constructor(private prisma: PrismaService) {
    
  }

  async validate(columnId: number): Promise<boolean> {
    console.log(columnId)
  const column = await this.prisma.columns.findUnique({
    where: { id: columnId },
  });
    console.log(column)

  return !!column;
}

  defaultMessage(args: ValidationArguments): string {
    return `Column with id ${args.value} does not exist`;
  }
}
