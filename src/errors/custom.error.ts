import { ErrorCode } from './error-code.enum';

export class CustomError extends Error {
  constructor(
    readonly errorCode: ErrorCode
  ) {
    super(errorCode.message);
  }
}