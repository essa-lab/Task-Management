import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class TaskExist implements ValidatorConstraintInterface {
  constructor(private prisma: PrismaService) {
    
  }

  async validate(taskId: number): Promise<boolean> {
  const task = await this.prisma.tasks.findUnique({
    where: { id: taskId },
  });

  return !!task;
}

  defaultMessage(args: ValidationArguments): string {
    return `task with id ${args.value} does not exist`;
  }
}
