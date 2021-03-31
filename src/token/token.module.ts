import { Module } from '@nestjs/common';
import { TokenRedis } from './token.redis';
import { TokenService } from './token.service';

@Module({
  providers: [TokenService, TokenRedis],
  exports: [TokenService, TokenRedis],
})
export class TokenModule { }
