import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { AuthFailedError } from 'errors/auth-failed';
import { DataConflictError } from 'errors/data-conflict';
import { DataNotFoundError } from 'errors/data-not-found';
import { ErrorCode } from 'errors/error-code.enum';
import { ExpiredError } from 'errors/expired.error';
import { ErrorResponse } from 'models/http/error.response';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(err: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();

    let errorResponse = null;
    switch (err.constructor) {
      case BadRequestException:
        errorResponse = ErrorResponse
          .fromErrorCode(HttpStatus.BAD_REQUEST, ErrorCode.INVALID_INPUT);
        break;

      case AuthFailedError:
        errorResponse = ErrorResponse
          .fromErrorCode(HttpStatus.UNAUTHORIZED, err.errorCode);
        break;

      case DataNotFoundError:
        errorResponse = ErrorResponse
          .fromErrorCode(HttpStatus.NOT_FOUND, err.errorCode);
        break;

      case DataConflictError:
        errorResponse = ErrorResponse
          .fromErrorCode(HttpStatus.CONFLICT, err.errorCode);
        break;

      case ExpiredError:
        errorResponse = ErrorResponse
          .fromErrorCode(HttpStatus.GONE, err.errorCode);
        break;

      default:
        errorResponse = ErrorResponse
          .fromErrorCode(HttpStatus.INTERNAL_SERVER_ERROR, ErrorCode.SERVER_ERROR);
    }

    console.log(err);

    res.status(errorResponse.status).json(errorResponse);
  }
}