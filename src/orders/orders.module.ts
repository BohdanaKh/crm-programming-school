import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '../common/orm/prisma.service';
import { UserModule } from '../users/users.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [UserModule],
  providers: [OrdersService, PrismaService, JwtService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
