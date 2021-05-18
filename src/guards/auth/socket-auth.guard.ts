import { ExecutionContext, Injectable } from '@nestjs/common';
import { WsArgumentsHost } from '@nestjs/common/interfaces';
import { TOKEN_KEY } from 'constants/token';
import { ErrorCode } from 'errors/error-code.enum';
import { InvalidDataError } from 'errors/invalid-data.error';
import { Socket } from 'socket.io';
import { TokenService } from 'token/token.service';
import { UserService } from 'user/user.service';
import { isString } from 'utils/type/string.util';
import { AuthGuard } from './auth.guard';

@Injectable()
export class SocketAuthGuard extends AuthGuard {
  constructor(
    tokenService: TokenService,
    userService: UserService,
  ) {
    super(tokenService, userService);
  }

  switchContext(context: ExecutionContext): WsArgumentsHost {
    return context.switchToWs();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = this.switchContext(context).getClient<Socket>();
    const token = client.handshake.query[TOKEN_KEY];

    if (!isString(token)) {
      throw new InvalidDataError(ErrorCode.INVALID_INPUT);
    }

    const decoded = this.decodeToken(token);
    client.user = await this.findUser(decoded.id)

    return true;
  }
}