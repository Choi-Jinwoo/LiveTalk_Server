import { CustomError } from 'errors/custom.error';
import { ErrorCode } from 'errors/error-code.enum';

export class DataNotFounded extends CustomError {
  constructor(readonly errorCode: ErrorCode) {
    super(errorCode.message);
  }
}