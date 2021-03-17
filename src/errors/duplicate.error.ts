import { CustomError } from './custom.error';
import { ErrorCode } from './error-code.enum';

export class DuplicateError extends CustomError {
  constructor(readonly errorCode: ErrorCode) {
    super(errorCode);
  }
}