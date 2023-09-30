import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UserModule } from '../users/users.module';
import { UserService } from '../users/users.service';
import { AuthModule } from './auth.module';
import { BearerStrategy } from './bearer.strategy';

@Global()
@Module({
  imports: [
    UserModule,
    AuthModule,
    PassportModule.register({ defaultStrategy: 'bearer' }),
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_SECRET_KEY,
        signOptions: {
          expiresIn: process.env.JWT_TTL,
        },
      }),
    }),
  ],
  providers: [BearerStrategy, UserService],
  exports: [PassportModule],
})
export class PassportWrapperModule {}
