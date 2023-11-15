import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
// import { InjectRedisClient, RedisClient } from '@webeleon/nestjs-redis';
import * as bcrypt from 'bcrypt';
import * as dayjs from 'dayjs';

import { PrismaService } from '../../common/orm/prisma.service';
import { UserMapper } from '../../users/users.mapper';
import { UserService } from '../../users/users.service';
import { TokenType } from '../models_dtos/enums';
import { JWTPayload } from '../models_dtos/interface';
import { UserLoginDto } from '../models_dtos/request';
import { LoginResponseDto } from '../models_dtos/response';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService, // @InjectRedisClient() private redisClient: RedisClient,
  ) {}

  async login(loginUser: UserLoginDto): Promise<LoginResponseDto> {
    const findUser = await this.userService.findUserByEmail(loginUser.email);
    if (!findUser) {
      throw new UnauthorizedException('Email or password is not correct');
    }
    if (!findUser.is_active) {
      throw new HttpException('Access denied', 403);
    }

    if (await this.compareHash(loginUser.password, findUser.password)) {
      const payload: JWTPayload = {
        id: findUser.id.toString(),
        email: findUser.email,
        surname: findUser.surname,
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
      // const userId = findUser.id.toString();
      const token = this.tokenService.generateAuthToken(payload);
      // const { accessToken, refreshToken } = token;
      // await this.redisClient.setEx(`accessToken:${userId}`, 3600, accessToken);
      // await this.redisClient.setEx(
      //   `refreshToken:${userId}`,
      //   86400,
      //   refreshToken,
      // );
      return { token, user: UserMapper.toResponseDto(findUser) };
    }
    throw new UnauthorizedException('Email or password is not correct');
  }

  async generateActivationToken(userId: string): Promise<string> {
    const user = await this.userService.getUserById(userId);
    try {
      const userJwtPayload: JWTPayload = {
        id: user.id.toString(),
        email: user.email,
        surname: user.surname,
        role: user.role,
      };
      const { activationToken } =
        await this.tokenService.generateActivationToken(userJwtPayload);
      return activationToken;
    } catch (e) {
      throw new HttpException('User activation failed', 400);
    }
  }
  async generateRecoveryToken(userId: string): Promise<string> {
    const user = await this.userService.getUserById(userId);
    try {
      const userJwtPayload: JWTPayload = {
        id: user.id.toString(),
        email: user.email,
        surname: user.surname,
        role: user.role,
      };
      const { recoveryToken } =
        this.tokenService.generateRecoveryToken(userJwtPayload);
      return recoveryToken;
    } catch (e) {
      throw new HttpException('Password recovery failed', 400);
    }
  }

  async renewAccess(refreshToken: string): Promise<LoginResponseDto> {
    try {
      const user: JWTPayload = await this.tokenService.verifyToken(
        refreshToken,
        TokenType.Refresh,
      );
      const findUser = await this.userService.findUserByEmail(user.email);
      const token = await this.tokenService.generateRefreshToken(refreshToken);
      return { token, user: UserMapper.toResponseDto(findUser) };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async compareHash(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
