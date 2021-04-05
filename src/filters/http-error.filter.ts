import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, ExecutionContext, HttpStatus } from '@nestjs/common';
import { CTX_HTTP_TYPE, CTX_WS_TYPE } from 'constants/request';
import { AuthFailedError } from 'errors/auth-failed.error';
import { DataConflictError } from 'errors/data-conflict.error';
import { DataNotFoundError } from 'errors/data-not-found.error';
import { ErrorCode } from 'errors/error-code.enum';
import { ExpiredError } from 'errors/expired.error';
import { InvalidDataError } from 'errors/invalid-data.error';
import { Response } from 'express';
import { ErrorResponse } from 'models/http/error.response';
import { Socket } from 'socket.io';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {

  private errorToErrorResponse = (err: any) => {
    switch (err.constructor) {
      case BadRequestException:
        return ErrorResponse
          .fromErrorCode(HttpStatus.BAD_REQUEST, ErrorCode.INVALID_INPUT);

      case InvalidDataError:
        return ErrorResponse
          .fromErrorCode(HttpStatus.BAD_REQUEST, err.errorCode);

      case AuthFailedError:
        return ErrorResponse
          .fromErrorCode(HttpStatus.UNAUTHORIZED, err.errorCode);

      case DataNotFoundError:
        return ErrorResponse
          .fromErrorCode(HttpStatus.NOT_FOUND, err.errorCode);

      case DataConflictError:
        return ErrorResponse
          .fromErrorCode(HttpStatus.CONFLICT, err.errorCode);

      case ExpiredError:
        return ErrorResponse
          .fromErrorCode(HttpStatus.GONE, err.errorCode);

      default:
        return ErrorResponse
          .fromErrorCode(HttpStatus.INTERNAL_SERVER_ERROR, ErrorCode.SERVER_ERROR);
    }
  }

  catch(err: any, host: ArgumentsHost) {
    const errorResponse = this.errorToErrorResponse(err);

    const httpCtx = host.switchToHttp();
    const res = httpCtx.getResponse<Response>();
    res.status(errorResponse.status).json(errorResponse);
  }
}