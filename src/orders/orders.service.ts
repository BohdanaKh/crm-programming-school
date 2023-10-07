import { Injectable, NotFoundException } from '@nestjs/common';
import { Orders, Prisma } from '@prisma/client';

import { PrismaService } from '../common/orm/prisma.service';
import { PaginatedDto } from '../common/pagination/response';
import { PublicOrderInfoDto } from '../common/query/order.query.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}
  async findAllWithPagination(
    query: PublicOrderInfoDto,
  ): Promise<PaginatedDto<Orders>> {
    const { sort, order } = query;
    const sortingOptions = {
      id: {
        orderBy: {
          id: order,
        },
      },
      name: {
        orderBy: {
          name: order,
        },
      },
      surname: {
        orderBy: {
          surname: order,
        },
      },
      email: {
        orderBy: {
          email: order,
        },
      },
      phone: {
        orderBy: {
          phone: order,
        },
      },
      age: {
        orderBy: {
          age: order,
        },
      },
      course: {
        orderBy: {
          course: order,
        },
      },
      course_format: {
        orderBy: {
          course_format: order,
        },
      },
      course_type: {
        orderBy: {
          course_type: order,
        },
      },
      status: {
        orderBy: {
          status: order,
        },
      },
      sum: {
        orderBy: {
          sum: order,
        },
      },
      alreadyPaid: {
        orderBy: {
          alreadyPaid: order,
        },
      },
      created_at: {
        orderBy: {
          created_at: order,
        },
      },
      created_at_desc: {
        orderBy: {
          created_at: 'desc',
        },
      },
    };
    const orderBy =
      sortingOptions[sort]['orderBy'] ||
      sortingOptions.created_at_desc['orderBy'];

    const limit = 25;
    const page = +query.page || 1;
    const skip = (page - 1) * limit;
    const count = await this.prisma.orders.count();
    const entities = await this.prisma.orders.findMany({
      take: limit,
      skip: skip,
      orderBy,
      where: {
        name: query.name,
        surname: query.surname,
        email: query.email,
        phone: query.phone,
        age: query.age,
        course: query.course,
        course_format: query.courseFormat,
        course_type: query.courseType,
        status: query.status,
        group: query.group,
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
