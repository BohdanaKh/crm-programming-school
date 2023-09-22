import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../common/orm/prisma.service';
import { JWTPayload } from './interface/auth.interface';

@Injectable()
export class AuthService {
  private salt = 10;
  constructor(
    private readonly jwtService: JwtService,
    private prisma: PrismaService,
  ) {}
  // async login() {}

  async signIn(data: JWTPayload): Promise<string> {
    return this.jwtService.sign(data);
  }

  async validateUser(data: JWTPayload): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: Number(data.id),
      },
    });
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
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
