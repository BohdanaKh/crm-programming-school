import {
  Body,
  Controller,
  HttpStatus,
  Post, Query,
  Res,
  UseGuards
} from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

import { UserService } from '../users/users.service';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/user.login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterDto } from "./dto/user.register.dto";

function LogoutGuard() {}

@ApiTags('Login')
@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}
  @UseGuards(AuthGuard())
  @Post('login')
  async login(@Res() res: any, @Body() loginUser: UserLoginDto) {
    const findUser = await this.userService.findUserByEmail(loginUser.email);
    if (!findUser) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Email or password is incorrect' });
    }
    if (
      await this.authService.compareHash(loginUser.password, findUser.password)
    ) {
      const token = await this.authService.signIn(findUser.id.toString());
      return res.status(HttpStatus.OK).json({ token });
    }
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: 'Email or password is incorrect' });
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(AuthGuard(), LogoutGuard)
  @Post('logout')
  async logout(@Res() res: any) {
    return res.status(HttpStatus.OK).json('logout');
  }

  @Post('register')
  async registerUser(@Res() res: any, @Query() token: string, @Body() body: RegisterDto) {
    let findUser;
    try {
      findUser = await this.userService.findUserByEmail(body.email.trim());
    } catch (err) {
      console.log(err);
    }
    if (findUser) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'User with this email already exists' });
    }
    const user = await this.userService.createUser({
      name: body.name ? body.name : 'Manager', // body.name || body.email,
      surname: body.surname,
      email: body.email,
      password: body.password,
    });

    if (user) {
      const subject = 'Welcome on board!';
      this.mailService.send(user.email, subject, MailTemplate.WELCOME, {
        userName: user.name,
      });
      const token = await this.authService.singIn(user.id.toString());
      return res.status(HttpStatus.OK).json({ token });
    }

    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ message: 'Error.Register_user_failed' });
  }

  @Post('activate')
  async activateUser(){
    return this.authService.generateActionTokenUrl()
  }
}
