import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from 'auth/dto/login.dto';
import { User } from 'entities/user.entity';
import { DodamThirdParty } from 'third-party/dodam.third-party';
import { TokenService } from 'token/token.service';
import { UserRepository } from './user.repository';
import { Subject } from 'rxjs';
import { AuthFailedError } from 'errors/auth-failed.error';
import { ErrorCode } from 'errors/error-code.enum';
import { Builder } from 'utils/builder/builder.util';

@Injectable()
export class UserService {
  private readonly saveUser$: Subject<User> = new Subject();

  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    private readonly dodamThirdParty: DodamThirdParty,
    private readonly tokenService: TokenService,
  ) {
    this.subscribeUserSave();
  }

  private subscribeUserSave() {
    this.saveUser$.subscribe({
      next: (user) => {
        this.userRepository.save(user);
      },
    });

    this.saveUser$.subscribe({
      next: async (user) => {
        const { id, dodamToken } = user;

        await this.tokenService.save(id, dodamToken);
      },
    })
  }

  async findOne(id: string): Promise<User | undefined> {
    return this.userRepository.findOne(id);
  }

  async login(loginDto: LoginDto): Promise<string> {
    const { id, pw } = loginDto;

    let user = await this.userRepository.findOne(id);

    // 가입되지 않은 회원일 경우 새로운 회원 생성
    if (user === undefined) {
      user = Builder<User>()
        .id(id)
        .build();
    }

    // 토큰 갱신
    try {
      const dodamToken = await this.dodamThirdParty.login(id, pw);
      user.dodamToken = dodamToken;
    } catch (err) {
      throw new AuthFailedError(ErrorCode.LOGIN_FAILED);
    }

    await this.saveUser$.next(user);

    const token = this.tokenService.generate(user);

    return token;
  }
}
