import { Module } from '@nestjs/common';

import { PrismaService } from '../common/orm/prisma.service';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { UserModule } from '../users/users.module';
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [UserModule],
  providers: [OrdersService, PrismaService, JwtService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
