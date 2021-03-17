import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from 'auth/dto/login.dto';
import { User } from 'entities/user.entity';
import { ErrorCode } from 'errors/error-code.enum';
import { DodamThirdParty } from 'third-party/dodam.third-party';
import { TokenService } from 'token/token.service';
import { DataNotFounded } from './data-not-founded';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    private readonly dodamThirdParty: DodamThirdParty,
    private readonly tokenService: TokenService,
  ) { }

  async login(loginDto: LoginDto): Promise<string> {
    const { id, pw } = loginDto;

    const user = await this.userRepository.findOne(id);
    if (user === undefined) {
      throw new DataNotFounded(ErrorCode.MEMBER_NOT_REGISTERED);
    }

    // 토큰 갱신
    const dodamToken = await this.dodamThirdParty.login(id, pw);
    user.dodamToken = dodamToken;
    await this.userRepository.save(user);

    const token = this.tokenService.createToken(user);

    return token;
  }
}
