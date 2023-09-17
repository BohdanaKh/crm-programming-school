import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/user.login.dto';

@Controller('login')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('')
  async loginUser(@Body() body: UserLoginDto) {
    return this.authService.login(body);
  }
}
