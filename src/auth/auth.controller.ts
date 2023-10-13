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
import { JwtService } from '@nestjs/jwt';
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
import { LoginResponseDto } from "./models_dtos/response";

function LogoutGuard() {}

@ApiTags('Login')
@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    @InjectRedisClient() private redisClient: RedisClient,
  ) {}
  @Post('login')
  async login(@Body() loginUser: UserLoginDto): Promise<LoginResponseDto> {
    if (!loginUser.email && !loginUser.password) {
      throw new ApiError('Error.Check_request_params', 403);
    }
    return this.authService.login(loginUser);
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
    const jwtPayload = await this.authService.verify(activationToken);
    const { id } = jwtPayload;
    try {
      await this.userService.getUserById(id);
    } catch (err) {
      throw new ApiError(err.body, err.status);
    }
    return res
      .status(HttpStatus.OK)
      .json(await this.userService.activateUserByUser(id, body));
  }

  @ApiBearerAuth()
  @Roles('admin')
  @UseGuards(BearerAuthGuard, RoleGuard)
  @Post('activate/:userId')
  async activateUserByAdmin(@Param('userId') userId: string): Promise<void> {
    await this.authService.generateActivationTokenUrl(
      userId,
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
