import { Controller, HttpStatus, Post, Res } from '@nestjs/common';

@Controller('login')
export class AuthController {
  // constructor(private authService: AuthService) {}
  // @Post('')
  // async loginUser(@Body() body: UserLoginDto) {
  //   return this.authService.login(body);
  // }

  @Post('logout')
  async logout(@Res() res: any) {
    return res.status(HttpStatus.OK).json('logout');
  }
}
