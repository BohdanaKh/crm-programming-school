import { Injectable, NotFoundException } from '@nestjs/common';
import { Orders, Prisma } from '@prisma/client';

import { PrismaService } from '../common/orm/prisma.service';
import { PaginatedDto } from '../common/pagination/response';
// import { PaginatedDto } from '../common/pagination/response';
import { PublicOrderInfoDto } from '../common/query/order.query.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}
  async findAllWithPagination(
    query: PublicOrderInfoDto,
  ): Promise<PaginatedDto<Orders>> {
    // query.sort = query.sort || 'created_at';
    // query.order = query.order || 'ASC';
    const limit = 25;
    const page = +query.page || 1;
    const skip = (page - 1) * limit;
    const count = await this.prisma.orders.count();
    const entities = await this.prisma.orders.findMany({
      take: limit,
      skip: skip,
      orderBy: {
        created_at: 'desc',
      },
    });
    return {
      page: page,
      pages: Math.ceil(count / limit),
      countItem: count,
      entities,
    };
  }

  async findOne(id: number): Promise<Orders> {
    const order = await this.prisma.orders.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async update(id: number, data: Prisma.OrdersUpdateInput): Promise<Orders> {
    try {
      return await this.prisma.orders.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new Error(`Order update failed for ID ${id}`);
    }
  }

  async remove(id: number): Promise<Orders> {
    // const order = await this.findOne(id);

    try {
      return await this.prisma.orders.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error(`Order deletion failed for ID ${id}`);
    }
  }
}
