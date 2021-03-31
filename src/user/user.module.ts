import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DodamThirdParty } from 'third-party/dodam.third-party';
import { TokenModule } from 'token/token.module';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    TokenModule,
  ],
  providers: [UserService, DodamThirdParty],
  exports: [UserService],
})
export class UserModule { }
