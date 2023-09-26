import { HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { UserService } from '../users/users.service';
import { UserLoginDto } from './dto/user.login.dto';
import { EActionTokenTypes } from './enums/action-token-type.enum';
import { JWTPayload } from './interface/auth.interface';
import * as process from "process";

@Injectable()
export class AuthService {
  private salt = 10;
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async generateActionTokenUrl(
    payload: JWTPayload,
    tokenType: EActionTokenTypes,
  ): Promise<string> {
    try {
      let secret: string;

      switch (tokenType) {
        case EActionTokenTypes.Activate:
          secret = process.env.JWT_ACTIVATE_SECRET;
          break;
        case EActionTokenTypes.Forgot:
          secret = process.env.JWT_FORGOT_SECRET;
          break;
      }

      const token = this.jwtService.sign(payload, secret, { expiresIn: '30m' });
      return token;
    } catch (e) {
      throw new HttpException('Token not valid', 401);
    }
  }

  async login(user: UserLoginDto) {
    const payload = { username: user.userName, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async signIn(data: JWTPayload): Promise<string> {
    return this.jwtService.sign(data);
  }

  async validateUser(data: UserLoginDto): Promise<User> {
    const user = await this.userService.findByUserEmail(data.email);
    if (user && user.password === data.password) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async verify(token: string): Promise<JWTPayload> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (err) {
      console.log(new Date().toISOString(), token);
      throw new UnauthorizedException();
    }
  }

  decode(token: string): JWTPayload | any {
    try {
      return this.jwtService.decode(token);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(
        new Date().toISOString(),
        ' [JWT VERIFY ERROR] ',
        JSON.stringify(e),
        ' [TOKEN] ',
        token,
      );
    }
  }

  async getHash(password: string) {
    return await bcrypt.hash(password, this.salt);
  }

  async compareHash(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
