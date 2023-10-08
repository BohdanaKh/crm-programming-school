import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { RedisModule } from '@webeleon/nestjs-redis';
import * as process from 'process';

import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PassportWrapperModule } from './auth/passport-wrapper.module';
import { RoleGuard } from './common/guards/role.guard';
import { MailModule } from './common/mail.module';
import { PrismaService } from './common/orm/prisma.service';
import { OrdersModule } from './orders/orders.module';
import { UserModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RedisModule.forRoot({
      url: 'redis://localhost:6379',
    }),
    AuthModule,
    OrdersModule,
    UserModule,
    MailModule,
    PassportWrapperModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
  exports: [PrismaService],
})
export class AppModule {}
