import { GoneException, Injectable, NestMiddleware, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'entities/user.entity';
import { AuthFailedError } from 'errors/auth-failed';
import { DataNotFoundError } from 'errors/data-not-found';
import { ErrorCode } from 'errors/error-code.enum';
import { ExpiredError } from 'errors/expired.error';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { TokenService } from 'token/token.service';
import { UserRepository } from 'user/user.repository';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly tokenService: TokenService,

    @InjectRepository(User)
    private readonly userRepository: UserRepository,
  ) { }

  async use(req: any, res: any, next: () => void) {
    const token = req.headers['x-access-token'];

    try {
      const decoded = this.tokenService.verifyToken(token);
      const { id } = decoded;

      const user = await this.userRepository.findOne(id);
      if (user === undefined) {
        throw new DataNotFoundError(ErrorCode.USER_NOT_FOUND);
      }

      req['user'] = user;
      next();
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new ExpiredError(ErrorCode.TOKEN_EXPIRED);
      } else if (err instanceof JsonWebTokenError) {
        throw new AuthFailedError(ErrorCode.INVALID_TOKEN);
      }

      throw err;
    }
  }

}