import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { PrismaService } from '../common/orm/prisma.service';
import { UserModule } from '../users/users.module';
import { UserService } from '../users/users.service';
import { AuthModule } from './auth.module';
import { BearerStrategy } from './strategies';
import { RedisModule } from "@webeleon/nestjs-redis";


@Global()
@Module({
  imports: [
    RedisModule.forRoot({
      url: 'redis://localhost:6379',
    }),
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
  providers: [BearerStrategy, UserService, PrismaService],
  exports: [PassportModule],
})
export class PassportWrapperModule {}
