import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Something wrong';
    
    if (exception instanceof HttpException) {
      const exceptionResponse: any = exception.getResponse();
      status = exception.getStatus();
      message = exceptionResponse.message || 'Something wrong';
    }
    response.status(status).json({
      result: 0,
      message: message,
      data: null,
    });
  }
}