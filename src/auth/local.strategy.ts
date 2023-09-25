import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Strategy } from 'passport-local';

import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'userEmail',
      passwordField: 'password',
    });
  }

  async validate(userEmail: string, password: string): Promise<User> {
    const user = await this.authService.validateUser(userEmail, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
