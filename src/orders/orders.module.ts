import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { TokenService } from '../auth/services/token.service';
import { PrismaService } from '../common/orm/prisma.service';
import { AppConfigModule } from '../config/config.module';
import { UserModule } from '../users/users.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [AppConfigModule, UserModule],
  providers: [OrdersService, PrismaService, JwtService, TokenService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
