import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from 'user/user.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
  ) { }

  @Post()
  async login(@Body() loginDto: LoginDto) {
    await this.userService.login(loginDto);
  }
}
