import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { ApiError } from '../common/errors/api.error';
import { EEmailActions } from '../common/mail/email.enum';
import { MailService } from '../common/mail/mail.service';
import { UserService } from '../users/users.service';
import { EActionTokenTypes } from './models_dtos/enums';
import { JWTPayload } from './models_dtos/interface';

@Injectable()
export class AuthService {
  private salt = 10;
  constructor(
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly userService: UserService,
  ) {}

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

      const activationToken = await this.signIn({ payload, secret });
      const activationUrl = `${process.env.BASE_URL}/activate/${activationToken}`;
      console.log(process.env.EMAIL_USER);
      console.log(process.env.EMAIL_PASSWORD);
      console.log(activationUrl);
      // clipboard.write(activationUrl);

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

  // async login(user: UserLoginDto) {
  //   const findUser = await this.userService.findUserByEmail(user.email);
  //   const payload = {
  //     id: findUser.id,
  //     userName: findUser.name,
  //     role: findUser.role,
  //   };
  //   return {
  //     access_token: this.jwtService.sign(payload),
  //   };
  // }
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

  async verify(token: string, secret: string): Promise<JWTPayload> {
    try {
      return await this.jwtService.verifyAsync(token, { secret });
    } catch (err) {
      console.log(new Date().toISOString(), token);
      throw new UnauthorizedException();
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
