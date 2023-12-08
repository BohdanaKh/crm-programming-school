import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Orders, Status } from '@prisma/client';

import { JWTPayload } from '../auth/models_dtos/interface';
import { PrismaService } from '../common/orm/prisma.service';
import { PaginatedDto } from '../common/pagination';
import { PublicOrderInfoDto } from '../common/query';
import { OrderUpdateRequestDto } from './models-dtos';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}
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
      manager,
      managerId,
      start_date,
      end_date,
    } = query;
    const endOfDayOfStartDate = new Date(start_date);
    endOfDayOfStartDate.setUTCHours(23, 59, 59, 999);
    const endOfDayOfEndDate = new Date(end_date);
    endOfDayOfEndDate.setUTCHours(23, 59, 59, 999);
    const where = {
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
        {
          group: {
            contains: group || undefined,
          },
        },
        {
          manager: {
            contains: manager || undefined,
          },
        },
        {
          created_at:
            start_date || end_date
              ? {
                  gte: start_date ? new Date(start_date) : new Date(end_date),
                  lt: start_date ? endOfDayOfStartDate : endOfDayOfEndDate,
                }
              : undefined,
        },
        { age: +age || undefined },
        course ? { course } : undefined,
        course_format ? { course_format } : undefined,
        course_type ? { course_type } : undefined,
        status ? { status } : undefined,
        // group ? { group } : undefined,
        // manager ? { manager } : undefined,
        { managerId: +managerId || undefined },
      ].filter(Boolean),
    };

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

    const limit = +query.limit || 25;
    const page = +query.page || 1;
    const skip = (page - 1) * limit;
    try {
      const count = await this.prisma.orders.count({
        where,
      });
      if (count === 0) {
        throw new NotFoundException('No orders found');
      }

      const entities = await this.prisma.orders.findMany({
        take: limit,
        skip: skip,
        orderBy: sortBy ? sortOption : { created_at: 'desc' },
        where,
        include: {
          comments: true,
        },
      });
      return {
        page: page,
        pages: Math.ceil(count / limit),
        countItem: count,
        entities,
      };
    } catch (e) {
      throw new BadRequestException('Nothing was found on your request');
    }
  }

  async getOrderWithComments(orderId: string): Promise<Orders> {
    const order = await this.prisma.orders.findUnique({
      where: { id: +orderId },
      include: {
        comments: true,
      },
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} is not found`);
    }
    return order;
  }

  async update(
    user: JWTPayload,
    orderId: string,
    data: OrderUpdateRequestDto,
  ): Promise<Orders> {
    const findOrder = await this.getOneByIdOrThrow(orderId);
    if (findOrder.managerId && findOrder.managerId !== +user.id) {
      throw new ForbiddenException(
        `Order with ID ${orderId} is already being processed by another manager`,
      );
    }
    if (data.group) {
      const existGroup = await this.prisma.group.findFirst({
        where: {
          title: data?.group,
        },
      });
      if (!existGroup) {
        throw new NotFoundException(`Group ${data.group} doesn't exist`);
      }
    }
    try {
      let newManager: string;
      let newManagerId: number;
      if (data.status === Status.New) {
        newManager = '';
        newManagerId = null;
      } else {
        newManager = user.surname;
        newManagerId = +user.id;
      }
      for (const dataKey in data) {
        if (data[dataKey] !== '') {
          data[dataKey] = data[dataKey];
        } else {
          data[dataKey] = null;
        }
      }
      return await this.prisma.orders.update({
        where: {
          id: +orderId,
        },
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        data: {
          ...data,
          age: typeof data.age === 'string' ? +data.age : data.age,
          manager: newManager,
          managerId: newManagerId,
        },
      });
    } catch (error) {
      throw new BadRequestException(`Order update failed for ID ${orderId}`);
    }
  }

  async remove(id: string): Promise<void> {
    await this.getOneByIdOrThrow(id);
    try {
      await this.prisma.orders.delete({
        where: { id: +id },
      });
    } catch (error) {
      throw new BadRequestException(`Order deletion failed for ID ${id}`);
    }
  }
  private async getOneByIdOrThrow(orderId: string): Promise<Orders> {
    const order = await this.prisma.orders.findUnique({
      where: {
        id: +orderId,
      },
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
    return order;
  }
}
