import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from 'auth/dto/login.dto';
import { User } from 'entities/user.entity';
import { DodamThirdParty } from 'third-party/dodam.third-party';
import { TokenService } from 'token/token.service';
import { UserRepository } from './user.repository';
import { Subject } from 'rxjs';
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
      next: (user) => {
        const { id, dodamToken } = user;

        this.tokenService.save(id, dodamToken);
      },
    })
  }

  async findOne(id: string): Promise<User | undefined> {
    return this.userRepository.findOne(id);
  }

  async login(loginDto: LoginDto): Promise<string> {
    const { id, pw } = loginDto;

    // 토큰 갱신
    const dodamToken = await this.dodamThirdParty.login(id, pw);
    const profile = await this.dodamThirdParty.getProfile(dodamToken);

    const { grade, room, number, accessLevel, profileImage } = profile;

    const user = Builder<User>()
      .id(id)
      .dodamToken(dodamToken)
      .grade(grade)
      .room(room)
      .number(number)
      .accessLevel(accessLevel)
      .profileImage(profileImage)
      .build();

    await this.saveUser$.next(user);
    const token = this.tokenService.generate(user);

    return token;
  }
}
