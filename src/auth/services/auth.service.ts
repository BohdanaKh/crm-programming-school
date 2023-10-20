import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRedisClient, RedisClient } from '@webeleon/nestjs-redis';
import * as bcrypt from 'bcrypt';
import * as copyPaste from 'copy-paste';
import * as dayjs from 'dayjs';
import * as process from 'process';

import { EEmailActions } from '../../common/mail/email.enum';
import { MailService } from '../../common/mail/mail.service';
import { PrismaService } from '../../common/orm/prisma.service';
import { UserMapper } from '../../users/users.mapper';
import { UserService } from '../../users/users.service';
import { JWTPayload } from '../models_dtos/interface';
import { UserLoginDto } from '../models_dtos/request';
import { LoginResponseDto } from '../models_dtos/response';
import { AuthTokenResponseDto } from '../models_dtos/response/auth-token.response.dto';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
    private readonly userService: UserService,
    // private configService: AppConfigService,
    @InjectRedisClient() private redisClient: RedisClient,
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
      const userId = findUser.id.toString();
      const token = this.tokenService.generateAuthToken(payload);
      const { accessToken, refreshToken } = token;
      await this.redisClient.setEx(`accessToken:${userId}`, 3600, accessToken);
      await this.redisClient.setEx(
        `refreshToken:${userId}`,
        86400,
        refreshToken,
      );
      return { token, user: UserMapper.toResponseDto(findUser) };
    }
    throw new UnauthorizedException('Email or password is not correct');
  }

  async generateActivationTokenUrl(userId: string): Promise<void> {
    const user = await this.userService.getUserById(userId);
    try {
      const userJwtPayload: JWTPayload = {
        id: user.id.toString(),
        email: user.email,
        surname: user.surname,
        role: user.role,
      };
      const subject = 'Activate account';
      const template = EEmailActions.ACTIVATE;
      const { activationToken } =
        await this.tokenService.generateActivationToken(userJwtPayload);
      const activationUrl = `${process.env.BASE_URL}/activate/${activationToken}`;
      copyPaste.copy(activationUrl, () => {
        console.log('Copied to clipboard:', activationUrl);
      });

      await this.mailService.send(user.email, subject, template, {
        activationUrl,
      });
    } catch (e) {
      throw new HttpException('User activation failed', 400);
    }
  }
  async generateRecoveryTokenUrl(userId: string): Promise<void> {
    const user = await this.userService.getUserById(userId);
    try {
      const userJwtPayload: JWTPayload = {
        id: user.id.toString(),
        email: user.email,
        surname: user.surname,
        role: user.role,
      };
      const subject = 'Recovery password';
      const template = EEmailActions.RECOVERY_PASSWORD;
      const { recoveryToken } =
        this.tokenService.generateRecoveryToken(userJwtPayload);
      const recoveryUrl = `${process.env.BASE_URL}/recovery/${recoveryToken}`;
      copyPaste.copy(recoveryUrl, () => {
        console.log('Copied to clipboard:', recoveryUrl);
      });
      await this.mailService.send(user.email, subject, template, {
        recoveryUrl,
      });
    } catch (e) {
      throw new HttpException('Password recovery failed', 400);
    }
  }

  async renewAccess(userId: string): Promise<AuthTokenResponseDto> {
    try {
      const refreshToken = await this.redisClient.get(`refreshToken:${userId}`);
      return this.tokenService.generateRefreshToken(refreshToken);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async compareHash(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
