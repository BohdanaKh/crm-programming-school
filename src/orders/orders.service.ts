import { Injectable } from "@nestjs/common";

// import { Order } from '@prisma/client';
import { PrismaService } from '../common/orm/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}
  async findAllWithPagination(page: number) {
    const skip = (page - 1) * 25;
    const orders = await this.prisma.orders.findMany({
      take: 25,
      skip,
      orderBy: {
        created_at: 'desc',
      },
    });

    return orders;
  }
}
