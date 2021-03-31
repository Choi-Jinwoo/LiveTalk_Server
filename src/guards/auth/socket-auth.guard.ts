import { ExecutionContext } from '@nestjs/common';
import { WsArgumentsHost } from '@nestjs/common/interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { TOKEN_KEY } from 'constants/token';
import { User } from 'entities/user.entity';
import { ErrorCode } from 'errors/error-code.enum';
import { InvalidDataError } from 'errors/invalid-data.error';
import { Socket } from 'socket.io';
import { TokenService } from 'token/token.service';
import { UserRepository } from 'user/user.repository';
import { isString } from 'utils/type/string.util';
import { AuthGuard } from './auth.guard';

export class SocketAuthGuard extends AuthGuard {
  constructor(
    tokenService: TokenService,
    @InjectRepository(User)
    userRepository: UserRepository,
  ) {
    super(tokenService, userRepository);
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