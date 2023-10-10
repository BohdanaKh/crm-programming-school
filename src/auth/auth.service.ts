import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRedisClient, RedisClient } from '@webeleon/nestjs-redis';
import * as bcrypt from 'bcrypt';
import * as copyPaste from 'copy-paste';
import * as dayjs from 'dayjs';


import { ApiError } from '../common/errors/api.error';
import { EEmailActions } from '../common/mail/email.enum';
import { MailService } from '../common/mail/mail.service';
import { PrismaService } from '../common/orm/prisma.service';
import { OrdersService } from '../orders/orders.service';
import { UserService } from '../users/users.service';
import { EActionTokenTypes } from './models_dtos/enums';
import { JWTPayload } from './models_dtos/interface';
import { UserLoginDto } from './models_dtos/request';

@Injectable()
export class AuthService {
  private salt = 10;
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly userService: UserService,
    private ordersService: OrdersService,
    @InjectRedisClient() private redisClient: RedisClient,
  ) {}

  async login(loginUser: UserLoginDto) {
    const findUser = await this.userService.findUserByEmail(loginUser.email);
    if (!findUser) {
      throw new ApiError('Email or password is not correct', 401);
    }
    if (findUser.is_banned) {
      throw new HttpException('Access denied', 403);
    }

    if (await this.compareHash(loginUser.password, findUser.password)) {
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
      const token = await this.signIn(payload);
      await this.redisClient.setEx(token, 10000, token);

      await this.ordersService.findAllWithPagination({
        page: '1',
        sort: 'created_at',
        order: 'desc',
        limit: null,
        search: null,
        name: null,
        surname: null,
        email: null,
        phone: null,
        age: null,
        course: null,
        courseFormat: null,
        courseType: null,
        status: null,
        group: null,
      });
      return { token };
    }
    throw new ApiError('Email or password is not correct', 401);
  }

  async generateActivationTokenUrl(
    userId: string,
    tokenType: EActionTokenTypes,
  ): Promise<string> {
    try {
      const user = await this.userService.getUserById(userId);
      const payload: JWTPayload = {
        id: user.id.toString(),
        userName: user.name,
        role: user.role,
      };
      let secret: string;

      switch (tokenType) {
        case EActionTokenTypes.Activate:
          secret = process.env.JWT_ACTIVATE_SECRET;
          break;
        case EActionTokenTypes.Recovery:
          secret = process.env.JWT_RECOVERY_SECRET;
          break;
      }
      console.log(secret);
      const activationToken = this.jwtService.sign(payload, {
        secret,
        expiresIn: '30m',
      });
      const activationUrl = `${process.env.BASE_URL}/activate/${activationToken}`;
      console.log(process.env.EMAIL_USER);
      console.log(process.env.EMAIL_PASSWORD);
      console.log(activationUrl);
      copyPaste.copy(activationUrl, () => {
        console.log('Copied to clipboard:', activationUrl);
      });

      const subject = 'Activate account';
      return this.mailService.send(
        user.email,
        subject,
        EEmailActions.ACTIVATE,
        {
          activationUrl,
        },
      );
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  async signIn(data): Promise<string> {
    return this.jwtService.signAsync(data);
  }

  // async validateUser(data: UserLoginDto): Promise<User> {
  //   const user = await this.userService.findUserByEmail(data.email.trim());
  //   if (user && user.password === data.password) {
  //     const { password, ...result } = user;
  //     return result;
  //   }
  //
  //   return null;
  // }

  async verify(
    token: string,
    tokenType: EActionTokenTypes,
  ): Promise<JWTPayload> {
    let secret: string;

    switch (tokenType) {
      case EActionTokenTypes.Activate:
        secret = process.env.JWT_ACTIVATE_SECRET;
        break;
      case EActionTokenTypes.Recovery:
        secret = process.env.JWT_RECOVERY_SECRET;
        break;
    }

    try {
      return await this.jwtService.verifyAsync(token, { secret });
      // const jwtData = await this.jwtService.verifyAsync(token);
      // return jwtData.payload;
    } catch (e) {
      throw new ApiError('Token is not valid', 401);
    }
  }

  // async decode(token: string): Promise<JWTPayload | any> {
  //   try {
  //     return this.jwtService.decode(token);
  //   } catch (e) {
  //     // eslint-disable-next-line no-console
  //     console.log(
  //       new Date().toISOString(),
  //       ' [JWT VERIFY ERROR] ',
  //       JSON.stringify(e),
  //       ' [TOKEN] ',
  //       token,
  //     );
  //   }
  // }

  async getHash(password: string) {
    return await bcrypt.hash(password, this.salt);
  }

  async compareHash(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
