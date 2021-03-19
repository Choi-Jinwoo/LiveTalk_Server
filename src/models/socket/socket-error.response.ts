import { ErrorCode } from 'errors/error-code.enum';

export class SocketErrorResponse {
  static fromErrorCode(errorCode: ErrorCode) {
    const { code, message } = errorCode;
    return new SocketErrorResponse(code, message);
  }

  constructor(
    public code: string,
    public message: string,
  ) { }
}