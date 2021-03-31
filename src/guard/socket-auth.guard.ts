import { ExecutionContext } from '@nestjs/common';
import { WsArgumentsHost } from '@nestjs/common/interfaces';
import { TOKEN_KEY } from 'constants/token';
import { ErrorCode } from 'errors/error-code.enum';
import { InvalidDataError } from 'errors/invalid-data.error';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { isString } from 'util/type/string.util';
import { AuthGuard } from './auth.guard';

export class SocketAuthGuard extends AuthGuard {

  switchContext(context: ExecutionContext): WsArgumentsHost {
    return context.switchToWs();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const client = this.switchContext(context).getClient<Socket>();
    const token = client.handshake.query[TOKEN_KEY];
    if (!isString(token)) {
      throw new InvalidDataError(ErrorCode.INVALID_INPUT);
    }

    try {
      const decoded = this.decodeToken(token);
      client.decoded = decoded;

      return true;
    } catch (err) {
      return false;
    }
  }
}