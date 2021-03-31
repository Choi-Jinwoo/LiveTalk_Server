import { ExecutionContext } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { TOKEN_KEY } from 'constants/token';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { AuthGuard } from './auth.guard';
import { isString } from 'utils/type/string.util';
import { ErrorCode } from 'errors/error-code.enum';
import { InvalidDataError } from 'errors/invalid-data.error';

export class HttpAuthGuard extends AuthGuard {

  switchContext(context: ExecutionContext): HttpArgumentsHost {
    return context.switchToHttp();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = this.switchContext(context).getRequest<Request>();
    const token = req.headers[TOKEN_KEY];
    if (!isString(token)) {
      throw new InvalidDataError(ErrorCode.INVALID_INPUT);
    }

    const decoded = this.decodeToken(token);
    req.decoded = decoded;

    return true;
  }
}