import { Injectable } from '@nestjs/common';

import { PrismaService } from '../common/orm/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getOrdersCounts() {
    const totalOrdersCount = await this.prisma.orders.count();
    const statusCounts = await this.prisma.orders.groupBy({
      by: ['status'],
      _count: true,
    });
    return { totalOrdersCount, statusCounts };
  }
}
