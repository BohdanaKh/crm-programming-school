import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
// import { RedisModule } from '@webeleon/nestjs-redis';
import * as process from 'process';

import { MailModule } from '../common/mail.module';
import { PrismaService } from '../common/orm/prisma.service';
import { AppConfigModule } from '../config/config.module';
import { AppConfigService } from '../config/configuration.service';
import { OrdersModule } from '../orders/orders.module';
import { UserModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';
import { BearerStrategy } from './strategies';

const JwtFactory = (config: AppConfigService) => ({
  secret: config.accessTokenSecret,
  signOptions: {
    expiresIn: config.accessTokenExpiration,
  },
});

const JwtRegistrationOptions = {
  imports: [AppConfigModule],
  useFactory: JwtFactory,
  inject: [AppConfigService],
};

@Module({
  imports: [
    // RedisModule.forRoot({
    //   url: process.env.REDIS_URL,
    // }),
    AppConfigModule,
    UserModule,
    OrdersModule,
    MailModule,
    PassportModule.register({ defaultStrategy: 'bearer' }),
    JwtModule.registerAsync(JwtRegistrationOptions),
    // ConfigModule.forRoot({
    //   load: [configuration],
    // }),
  ],
  providers: [
    AuthService,
    BearerStrategy,
    PrismaService,
    TokenService,
    AppConfigService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
