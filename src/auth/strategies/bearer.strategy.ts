import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { InjectRedisClient, RedisClient } from '@webeleon/nestjs-redis';
import { Strategy } from 'passport-http-bearer';
import { ExtractJwt } from 'passport-jwt';

import { UserService } from '../../users/users.service';
import { AuthService } from '../auth.service';

@Injectable()
export class BearerStrategy extends PassportStrategy(Strategy, 'bearer') {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private userService: UserService,
    @InjectRedisClient() readonly redisClient: RedisClient,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  async validate(token: string): Promise<User> {
    let user: User;
    try {
      if (!(await this.redisClient.exists(token))) {
        throw new UnauthorizedException();
      }
      const payload = await this.jwtService.verify(token);
      user = await this.userService.getUserById(payload.id);
    } catch (err) {
      console.log(new Date().toISOString(), token);
      throw new UnauthorizedException();
    }
    return user;
  }
}
