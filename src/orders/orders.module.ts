import { Module } from '@nestjs/common';

import { PrismaService } from '../common/orm/prisma.service';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { UserModule } from '../users/users.module';

@Module({
  imports: [UserModule],
  providers: [OrdersService, PrismaService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
