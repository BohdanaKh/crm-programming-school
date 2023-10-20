import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { TokenService } from '../auth/services/token.service';
import { PrismaService } from '../common/orm/prisma.service';
import { AppConfigModule } from '../config/config.module';
import configuration from '../config/configuration';
import { UserController } from './users.controller';
import { UserService } from './users.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    AppConfigModule,
  ],
  providers: [UserService, PrismaService, TokenService, JwtService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
