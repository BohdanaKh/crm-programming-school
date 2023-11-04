import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
// import { InjectRedisClient, RedisClient } from '@webeleon/nestjs-redis';
import { Strategy } from 'passport-http-bearer';
import { ExtractJwt } from 'passport-jwt';

import { AppConfigService } from '../../config/configuration.service';
import { UserResponseDto } from '../../users/models/response';
import { UserMapper } from '../../users/users.mapper';
import { UserService } from '../../users/users.service';
import { TokenType } from '../models_dtos/enums';
import { TokenService } from '../services/token.service';

@Injectable()
export class BearerStrategy extends PassportStrategy(Strategy, 'bearer') {
  constructor(
    private tokenService: TokenService,
    private userService: UserService,
    private configService: AppConfigService, // @InjectRedisClient() readonly redisClient: RedisClient,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.accessTokenSecret,
    });
  }

  async validate(token: string): Promise<UserResponseDto> {
    let user: User;
    try {
      const payload = await this.tokenService.verifyToken(
        token,
        TokenType.Access,
      );
      user = await this.userService.getUserById(payload.id);
      // const { id } = user;
      // if (!(await this.redisClient.exists(`accessToken:${id}`))) {
      //   throw new UnauthorizedException();
      // }
      return UserMapper.toResponseDto(user);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
