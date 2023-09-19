import { Injectable } from '@nestjs/common';


import { PrismaService } from '../common/orm/prisma.service';
import { PaginatedDto } from '../common/pagination/response';
// import { PaginatedDto } from '../common/pagination/response';
import { PublicOrderInfoDto } from '../common/query/order.query.dto';
import { orders } from "@prisma/client";

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}
  async findAllWithPagination(
    query: PublicOrderInfoDto,
  ): Promise<PaginatedDto<orders>> {
    // query.sort = query.sort || 'created_at';
    // query.order = query.order || 'ASC';
    const limit = 25;
    const page = +query.page || 1;
    const skip = (page - 1) * limit;
    const count = await this.prisma.orders.count();
    const results = await this.prisma.orders.findMany({
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
      results,
    };
  }
}
