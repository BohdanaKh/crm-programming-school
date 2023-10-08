import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Orders, User } from '@prisma/client';
import { InjectRedisClient, RedisClient } from '@webeleon/nestjs-redis';
import * as dayjs from 'dayjs';
import * as process from 'process';

import { Roles } from '../common/decorators/roles.decorator';
import { ApiError } from '../common/errors/api.error';
import { BearerAuthGuard } from '../common/guards/bearer-auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { PrismaService } from '../common/orm/prisma.service';
import { PaginatedDto } from '../common/pagination/response';
import { OrdersService } from '../orders/orders.service';
import { UserService } from '../users/users.service';
import { AuthService } from './auth.service';
import { EActionTokenTypes } from './models_dtos/enums';
import { JWTPayload } from './models_dtos/interface';
import { ActivateUserDto, UserLoginDto } from './models_dtos/request';

function LogoutGuard() {}

@ApiTags('Login')
@Controller()
export class AuthController {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
    private userService: UserService,
    private ordersService: OrdersService,
    @InjectRedisClient() private redisClient: RedisClient,
  ) {}
  @Post('login')
  async login(
    @Body() loginUser: UserLoginDto,
    @Res() res: any,
  ): Promise<PaginatedDto<Orders>> {
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
    if (findUser.is_banned) {
      throw new HttpException('Access denied', 403);
    }

    if (
      await this.authService.compareHash(loginUser.password, findUser.password)
    ) {
      const payload: JWTPayload = {
        id: findUser.id.toString(),
        userName: findUser.name,
        role: findUser.role,
      };
      const currentDate = dayjs();
      const formattedDate = currentDate.format('MMMM DD, YYYY');
      await this.prisma.user.update({
        where: {
          id: findUser.id,
        },
        data: {
          last_login: formattedDate,
        },
      });
      const token = await this.authService.signIn(payload);
      await this.redisClient.setEx(token, 10000, token);
      return res.status(HttpStatus.OK).json({ token });
      //   return this.ordersService.findAllWithPagination({
      //     page: '1',
      //     sort: 'created_at',
      //     order: 'desc',
      //     limit: null,
      //     search: null,
      //     name: null,
      //     surname: null,
      //     email: null,
      //     phone: null,
      //     age: null,
      //     course: null,
      //     courseFormat: null,
      //     courseType: null,
      //     status: null,
      //     group: null,
      //   });
    }
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: 'Email or password is incorrect' });
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BearerAuthGuard, LogoutGuard)
  @Post('logout')
  async logout(@Res() res: any) {
    return res.status(HttpStatus.OK).json('logout');
  }
  // @ApiBearerAuth()
  @Put('activate/:activationToken')
  async activateUserByUser(
    @Res() res: any,
    @Param('activationToken') activationToken: string,
    @Body() body: ActivateUserDto,
  ): Promise<void> {
    // const secret = process.env.JWT_ACTIVATE_SECRET;
    const jwtPayload = await this.authService.verify(activationToken);
    console.log(jwtPayload);
    const { id } = jwtPayload;
    // try {
    //   await this.userService.getUserById(id);
    // } catch (err) {
    //   throw new ApiError(err.body, err.status);
    // }
    await this.userService.activateUserByUser(id, body);
  }

  @ApiBearerAuth()
  @Roles('admin')
  @UseGuards(BearerAuthGuard, RoleGuard)
  @Post('activate/:id')
  async activateUserByAdmin(@Param('id') id: string) {
    return this.authService.generateActivationTokenUrl(
      id,
      EActionTokenTypes.Activate,
    );
  }

  @ApiBearerAuth()
  @Roles('admin')
  @UseGuards(BearerAuthGuard, RoleGuard)
  @Post('recovery/:userId')
  async recoveryPassword(@Param('userId') userId: string) {
    return this.authService.generateActivationTokenUrl(
      userId,
      EActionTokenTypes.Recovery,
    );
  }
}
