import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Response } from 'express';

@Catch(Error)
export class AllExceptionFilter implements ExceptionFilter {
  private readonly loger = new Logger(AllExceptionFilter.name, {
    timestamp: true,
  });
  catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const Response = ctx.getResponse<Response>();
    this.loger.error('Error : ', error);

    return Response.status(500).json({
      statusCode: 500,
      message: 'Internal Server Errors',
    });
  }
}
