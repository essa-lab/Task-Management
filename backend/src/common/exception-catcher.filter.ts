// src/common/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { errorResponse } from './responses';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';
import { ValidationError } from 'class-validator';

@Catch()
export class AllExceptionsCatcher implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

     if (exception instanceof BadRequestException){
        return response.status(400).json(exception.getResponse());    
    }
    else if (exception instanceof HttpException) {
                    console.log(exception)

      status = exception.getStatus();
      message = exception.message || message;
    }else if (exception instanceof PrismaClientKnownRequestError){
              console.log(exception)

        status = HttpStatus.NOT_FOUND;
        message = "Requested Resource was not Found"
    }
    else if (exception instanceof ValidationError) {
        console.log(exception)
      message = exception.value;
    }
     else if (exception instanceof Error) {
        console.log(exception.cause)
      message = exception.message;
    }
                    console.log(exception)

    response.status(status).json(
        errorResponse(message)
    );
  }
}
