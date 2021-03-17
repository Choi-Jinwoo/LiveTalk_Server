import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { DataNotFoundError } from 'errors/data-not-found';
import { ExpiredError } from 'errors/expired.error';
import { ErrorResponse } from 'models/http/error.response';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(err: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();

    let errorResponse = null;
    switch (err.constructor) {
      case DataNotFoundError:
        errorResponse = ErrorResponse
          .fromErrorCode(HttpStatus.NOT_FOUND, err.errorCode);
        break;

      case ExpiredError:
        errorResponse = ErrorResponse
          .fromErrorCode(HttpStatus.GONE, err.errorCode);
        break;

      default:
        errorResponse = ErrorResponse
          .fromErrorCode(HttpStatus.GONE, err.errorCode);
    }

    res.status(errorResponse.status).json(errorResponse);
  }
}