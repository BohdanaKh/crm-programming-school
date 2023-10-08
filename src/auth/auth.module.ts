import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { MailModule } from '../common/mail.module';
import { PrismaService } from '../common/orm/prisma.service';
import { OrdersModule } from '../orders/orders.module';
import { UserModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BearerStrategy } from './strategies';
import { RedisModule } from "@webeleon/nestjs-redis";

@Module({
  imports: [
    RedisModule.forRoot({
      url: 'redis://localhost:6379',
    }),
    UserModule,
    OrdersModule,
    MailModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_SECRET_KEY,
        signOptions: {
          expiresIn: process.env.JWT_TTL,
        },
        verifyOptions: {
          clockTolerance: 60,
          maxAge: process.env.JWT_TTL,
        },
      }),
    }),
  ],
  providers: [AuthService, BearerStrategy, PrismaService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
