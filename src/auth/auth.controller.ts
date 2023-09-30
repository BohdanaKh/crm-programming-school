import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';

import { ApiError } from '../common/errors/api.error';
import { OrdersService } from '../orders/orders.service';
import { UserService } from '../users/users.service';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/user.login.dto';
import { ActivateUserDto } from './dto/user.register.dto';
import { EActionTokenTypes } from './enums/action-token-type.enum';
import { JWTPayload } from './interface/auth.interface';

function LogoutGuard() {}

@ApiTags('Login')
@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private ordersService: OrdersService,
  ) {}
  @Post('login')
  async login(@Res() res: any, @Body() loginUser: UserLoginDto) {
    if (!loginUser.email && !loginUser.password) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'Error.Check_request_params' });
    }
    const findUser = await this.userService.findUserByEmail(loginUser.email);
    if (!findUser) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Email or password is incorrect' });
    }
    if (
      await this.authService.compareHash(loginUser.password, findUser.password)
    ) {
      // const payload: JWTPayload = {
      //   id: findUser.id.toString(),
      //   userName: findUser.name,
      //   role: findUser.role,
      // };
      // const token = await this.authService.signIn(payload);
      // return res.status(HttpStatus.OK).json({ token });
      return this.ordersService.findAllWithPagination({
        page: '1',
        sort: 'created_at',
        order: 'desc',
        limit: '',
        search: '',
      });
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

  @Post('activate')
  async activateUserByUser(
    @Res() res: any,
    @Query() token: string,
    @Body() body: ActivateUserDto,
  ): Promise<User> {
    const jwtPayload = await this.authService.verify(token);
    console.log(jwtPayload);
    const { id } = jwtPayload;
    try {
      await this.userService.getUserById(id);
    } catch (err) {
      throw new ApiError(err.body, err.status);
    }
    return await this.userService.activateUserByUser(id, body);
  }

  @UseGuards(AuthGuard())
  @Post('activate')
  async activateUserByAdmin(@Body() body: JWTPayload) {
    return this.authService.generateActionTokenUrl(
      body,
      EActionTokenTypes.Activate,
    );
  }
}
