import { Injectable } from '@nestjs/common';
import { PrismaService } from "../common/orm/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class OrdersService {
  constructor(private readonly prismaService: PrismaService) {
  }
  async orders(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<Order[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prismaService.orders.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }
}
