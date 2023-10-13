import { Injectable, NotFoundException } from '@nestjs/common';
import { Orders } from '@prisma/client';

import { PrismaService } from '../common/orm/prisma.service';
import { PaginatedDto } from '../common/pagination/response';
import { PublicOrderInfoDto } from '../common/query/order.query.dto';
import { UserService } from '../users/users.service';
import { OrderUpdateRequestDto } from './models-dtos/order.update.request.dto';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}
  async findAllWithPagination(
    query: PublicOrderInfoDto,
  ): Promise<PaginatedDto<Orders>> {
    const {
      sort: sortBy,
      name,
      surname,
      email,
      phone,
      age,
      course,
      course_type,
      course_format,
      status,
      group,
    } = query;

    let sortOption: object;
    if (sortBy && sortBy.startsWith('-')) {
      sortOption = {
        [sortBy.slice(1)]: 'desc',
      };
    } else {
      sortOption = {
        [sortBy]: 'asc',
      };
    }

    // const orderBy = sortingOptions[sort] || sortingOptions.created_at_desc;

    const limit = 25;
    const page = +query.page || 1;
    const skip = (page - 1) * limit;
    const count = await this.prisma.orders.count();
    const entities = await this.prisma.orders.findMany({
      take: limit,
      skip: skip,
      orderBy: sortBy ? sortOption : { created_at: 'desc' },
      where: {
        AND: [
          {
            name: {
              contains: name || undefined,
            },
          },
          {
            surname: {
              contains: surname || undefined,
            },
          },
          {
            email: {
              contains: email || undefined,
            },
          },
          {
            phone: {
              contains: phone || undefined,
            },
          },
          age ? { age } : undefined,
          course ? { course } : undefined,
          course_format ? { course_format } : undefined,
          course_type ? { course_type } : undefined,
          status ? { status } : undefined,
          group ? { group } : undefined,
        ].filter(Boolean),
      },
    });

    return {
      page: page,
      pages: Math.ceil(count / limit),
      countItem: count,
      entities,
    };
  }

  async findOne(orderId: string): Promise<Orders> {
    const order = await this.prisma.orders.findUnique({
      where: { id: +orderId },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} is not found`);
    }

    return order;
  }

  async update(
    userId: string,
    orderId: string,
    data: OrderUpdateRequestDto,
  ): Promise<Orders> {
    const user = await this.userService.getUserById(userId);
    try {
      return await this.prisma.orders.update({
        where: {
          id: +orderId,
        },
        data: { ...data, managerId: user.id, manager: user.surname },
      });
    } catch (error) {
      throw new Error(`Order update failed for ID ${orderId}`);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.prisma.orders.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error(`Order deletion failed for ID ${id}`);
    }
  }
}
