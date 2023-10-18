import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRedisClient, RedisClient } from '@webeleon/nestjs-redis';
import * as bcrypt from 'bcrypt';
import * as copyPaste from 'copy-paste';
import * as dayjs from 'dayjs';
import * as process from 'process';

import { EEmailActions } from '../common/mail/email.enum';
import { MailService } from '../common/mail/mail.service';
import { PrismaService } from '../common/orm/prisma.service';
import { UserMapper } from '../users/users.mapper';
import { UserService } from '../users/users.service';
import { EActionTokenTypes } from './models_dtos/enums';
import { JWTPayload } from './models_dtos/interface';
import { UserLoginDto } from './models_dtos/request';
import { LoginResponseDto } from './models_dtos/response';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly userService: UserService,
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
        userName: findUser.name,
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
      const token = await this.signIn(payload);
      await this.redisClient.setEx(token, 10000, token);
      return { token, user: UserMapper.toResponseDto(findUser) };
    }
    throw new UnauthorizedException('Email or password is not correct');
  }

  async generateActivationTokenUrl(
    userId: string,
    tokenType: EActionTokenTypes,
  ) {
    const user = await this.userService.getUserById(userId);
    try {
      const userJwtPayload: JWTPayload = {
        id: user.id.toString(),
        userName: user.name,
        surname: user.surname,
        role: user.role,
      };
      let secretKey: string;
      let subject: string;
      let template: string;

      switch (tokenType) {
        case EActionTokenTypes.Activate:
          secretKey = process.env.JWT_ACTIVATE_SECRET;
          subject = 'Activate account';
          template = EEmailActions.ACTIVATE;
          break;
        case EActionTokenTypes.Recovery:
          secretKey = process.env.JWT_RECOVERY_SECRET;
          subject = 'Recovery password';
          template = EEmailActions.RECOVERY_PASSWORD;
          break;
      }
      const expirationTime = process.env.JWT_ACTIVATE_TTL;
      const activationToken = await this.signIn({
        payload: userJwtPayload,
        options: { secret: secretKey, expiresIn: expirationTime },
      });
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

  async signIn(data): Promise<string> {
    return this.jwtService.signAsync(data);
  }

  async verify(token: string): Promise<JWTPayload> {
    try {
      const jwtData = await this.jwtService.verifyAsync(token);
      return jwtData.payload;
    } catch (error) {
      // throw new HttpException('Token is not valid', 401);
      if (error.name === 'TokenExpiredError') {
        console.log('Token has expired');
      } else {
        console.log('Invalid token:', error.message);
      }
    }
  }

  async compareHash(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
