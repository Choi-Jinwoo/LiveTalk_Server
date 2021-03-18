import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'entities/user.entity';
import { RedisClientModule } from 'redis-client/redis-client.module';
import { DodamThirdParty } from 'third-party/dodam.third-party';
import { TokenModule } from 'token/token.module';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TokenModule,
    RedisClientModule,
  ],
  providers: [UserService, DodamThirdParty],
  exports: [UserService],
})
export class UserModule { }
