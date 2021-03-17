import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'entities/user.entity';
import { DodamThirdParty } from 'third-party/dodam.third-party';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, DodamThirdParty],
  exports: [UserService],
})
export class UserModule { }
