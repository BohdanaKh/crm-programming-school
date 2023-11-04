import { Global, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
// import { RedisModule } from '@webeleon/nestjs-redis';
import * as process from 'process';

import { AdminModule } from '../admin/admin.module';
import { PrismaService } from '../common/orm/prisma.service';
import { AppConfigModule } from '../config/config.module';
import { UserModule } from '../users/users.module';
import { UserService } from '../users/users.service';
import { AuthModule } from './auth.module';
import { TokenService } from './services/token.service';
import { BearerStrategy } from './strategies';

@Global()
@Module({
  imports: [
    // RedisModule.forRoot({
    //   url: process.env.REDIS_URL,
    // }),
    UserModule,
    AuthModule,
    AdminModule,
    AppConfigModule,
    PassportModule.register({ defaultStrategy: 'bearer' }),
  ],
  providers: [
    BearerStrategy,
    UserService,
    PrismaService,
    TokenService,
    JwtService,
  ],
  exports: [PassportModule],
})
export class PassportWrapperModule {}
