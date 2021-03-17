import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from 'errors/error-code.enum';

export class ErrorResponse {
  static fromErrorCode(status: HttpStatus, errorCode: ErrorCode) {
    const { code, message } = errorCode;
    return new ErrorResponse(status, code, message);
  }

  constructor(
    public status: HttpStatus,
    public code: string,
    public message: string,
  ) { }
}