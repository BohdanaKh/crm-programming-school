import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/user.login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@ApiTags('Login')
@Controller('login')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post()
  async login(@Body() loginUser: UserLoginDto) {
    return this.authService.login(loginUser);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async logout(@Res() res: any) {
    return res.status(HttpStatus.OK).json('logout');
  }
}
