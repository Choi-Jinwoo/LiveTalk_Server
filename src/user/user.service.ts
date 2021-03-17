import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from 'auth/dto/login.dto';
import { User } from 'entities/user.entity';
import { DodamThirdParty } from 'third-party/dodam.third-party';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    private readonly dodamThirdParty: DodamThirdParty,
  ) { }

  async login(loginDto: LoginDto) {
    const { id, pw } = loginDto;

    // TODO: 로컬 회원 테이블 검색

    await this.dodamThirdParty.login(id, pw);
  }
}
