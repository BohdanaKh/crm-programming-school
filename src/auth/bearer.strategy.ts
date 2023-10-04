import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Strategy } from 'passport-http-bearer';

import { UserService } from '../users/users.service';
import { AuthService } from './auth.service';
import { PublicUserData } from "../users/interface/user.interface";

@Injectable()
export class BearerStrategy extends PassportStrategy(Strategy, 'bearer') {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {
    super();
  }

  async validate(token: string): Promise<User> {
    let user: User;
    try {
      const payload = await this.jwtService.verify(token);
      user = await this.userService.getUserById(payload.id);
    } catch (err) {
      console.log(new Date().toISOString(), token);
      throw new UnauthorizedException();
    }
    return user;
  }
}
