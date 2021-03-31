import { CanActivate, ExecutionContext } from '@nestjs/common';
import { HttpArgumentsHost, WsArgumentsHost } from '@nestjs/common/interfaces';
import { AuthFailedError } from 'errors/auth-failed.error';
import { ErrorCode } from 'errors/error-code.enum';
import { ExpiredError } from 'errors/expired.error';
import { TokenExpiredError } from 'jsonwebtoken';
import { Observable } from 'rxjs';
import { TokenService } from 'token/token.service';

export abstract class AuthGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
  ) { }

  abstract switchContext(context: ExecutionContext): HttpArgumentsHost | WsArgumentsHost;

  abstract canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>

  decodeToken(token: string) {
    try {
      const decoded = this.tokenService.verifyToken(token);

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