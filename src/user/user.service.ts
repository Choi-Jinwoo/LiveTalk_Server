import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from 'auth/dto/login.dto';
import { User } from 'entities/user.entity';
import { DodamThirdParty } from 'third-party/dodam.third-party';
import { TokenService } from 'token/token.service';
import { UserRepository } from './user.repository';
import { Subject } from 'rxjs';
import { RedisClientService } from 'redis-client/redis-client.service';

@Injectable()
export class UserService {
  private readonly user$: Subject<User> = new Subject();

  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    private readonly dodamThirdParty: DodamThirdParty,
    private readonly tokenService: TokenService,
    private readonly redisClientService: RedisClientService,
  ) {
    this.subscribeUserSave();
  }

  private subscribeUserSave() {
    this.user$.subscribe({
      next: (user) => {
        this.userRepository.save(user);
      },
    });

    this.user$.subscribe({
      next: async (user) => {
        const { id, dodamToken } = user;

        await this.redisClientService.setToken(id, dodamToken);
      },
    })
  }

  async login(loginDto: LoginDto): Promise<string> {
    const { id, pw } = loginDto;

    let user = await this.userRepository.findOne(id);

    // 가입되지 않은 회원일 경우 새로운 회원 생성
    if (user === undefined) {
      user = new User();
      user.id = id;
    }

    // 토큰 갱신
    const dodamToken = await this.dodamThirdParty.login(id, pw);
    user.dodamToken = dodamToken;

    await this.user$.next(user);

    const token = this.tokenService.createToken(user);

    return token;
  }
}
