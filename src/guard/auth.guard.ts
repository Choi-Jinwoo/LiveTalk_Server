import { CanActivate, ExecutionContext } from '@nestjs/common';
import { HttpArgumentsHost, WsArgumentsHost } from '@nestjs/common/interfaces';
import { Observable } from 'rxjs';
import { TokenService } from 'token/token.service';

export abstract class AuthGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
  ) { }

  abstract switchContext(context: ExecutionContext): HttpArgumentsHost | WsArgumentsHost;

  abstract canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>

  decodeToken(token: string) {
    const decoded = this.tokenService.verifyToken(token);

    return decoded;
  }
}