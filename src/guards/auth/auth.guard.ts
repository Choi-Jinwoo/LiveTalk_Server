import { CanActivate, ExecutionContext } from '@nestjs/common';
import { HttpArgumentsHost, WsArgumentsHost } from '@nestjs/common/interfaces';
import { User } from 'entities/user.entity';
import { AuthFailedError } from 'errors/auth-failed.error';
import { DataNotFoundError } from 'errors/data-not-found.error';
import { ErrorCode } from 'errors/error-code.enum';
import { ExpiredError } from 'errors/expired.error';
import { TokenExpiredError } from 'jsonwebtoken';
import { TokenService } from 'token/token.service';
import { UserService } from 'user/user.service';

export abstract class AuthGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) { }

  abstract switchContext(context: ExecutionContext): HttpArgumentsHost | WsArgumentsHost;

  abstract canActivate(context: ExecutionContext): Promise<boolean>;

  async findUser(id: string): Promise<User> {
    const user = await this.userService.findOne(id);
    if (user === undefined) {
      throw new DataNotFoundError(ErrorCode.USER_NOT_FOUND);
    }

    return user;
  }

  decodeToken(token: string) {
    try {
      const decoded = this.tokenService.verify(token);

      return decoded;
    } catch (err) {
      switch (err.constructor) {
        case TokenExpiredError:
          throw new ExpiredError(ErrorCode.TOKEN_EXPIRED);

        case AuthFailedError:
          throw new AuthFailedError(ErrorCode.INVALID_TOKEN);

        default:
          throw err;
      }
    }
  }
}