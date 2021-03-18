import { Body, Controller, Post } from '@nestjs/common';
import { BaseResponse } from 'models/http/base.response';
import { UserService } from 'user/user.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
  ) { }

  @Post()
  async login(@Body() loginDto: LoginDto): Promise<BaseResponse> {
    const token = await this.userService.login(loginDto);

    return BaseResponse.object('로그인 성공', {
      'x-access-token': token,
    });
  }
}
