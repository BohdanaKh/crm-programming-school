import { Module } from '@nestjs/common';

import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { PrismaService } from "../common/orm/prisma.service";

@Module({
  providers: [OrdersService, PrismaService],
  controllers: [OrdersController],
})
export class OrdersModule {}
