import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Orders } from '@prisma/client';

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

    const limit = 25;
    const count = await this.prisma.orders.count();
    function checkStrDigit(str: string): boolean {
      return /^\d+$/.test(str);
    }
    if (
      query.page &&
      (+query.page > Math.ceil(count / limit) ||
        +query.page < 1 ||
        !checkStrDigit(query.page))
    ) {
      throw new BadRequestException(`Page ${query.page} is not found`);
    }
    const page = +query.page || 1;
    const skip = (page - 1) * limit;
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
          { age: +age || undefined },
          course ? { course } : undefined,
          course_format ? { course_format } : undefined,
          course_type ? { course_type } : undefined,
          status ? { status } : undefined,
          group ? { group } : undefined,
          manager ? { manager } : undefined,
          { managerId: +managerId || undefined },
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

  // async findOne(orderId: string): Promise<Orders> {
  //   const order = await this.prisma.orders.findUnique({
  //     where: { id: +orderId },
  //   });
  //
  //   if (!order) {
  //     throw new NotFoundException(`Order with ID ${orderId} is not found`);
  //   }
  //
  //   return order;
  // }

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
    try {
      let groupName: string;
      let newGroupId: number;
      if (data.groupId) {
        const existingGroup = await this.prisma.group.findUnique({
          where: { id: +data.groupId },
        });
        groupName = existingGroup.title;
      } else if (data.group) {
        const foundGroup = await this.prisma.group.findFirst({
          where: {
            title: data.group,
          },
        });
        if (foundGroup) {
          newGroupId = foundGroup.id;
        } else {
          const newGroup = await this.prisma.group.create({
            data: { title: data.group },
          });
          newGroupId = newGroup.id;
        }
      } else if (data.group === null) {
        newGroupId = null;
        groupName = null;
      }
      return await this.prisma.orders.update({
        where: {
          id: +orderId,
        },
        data: {
          ...data,
          groupId: +data.groupId || newGroupId,
          group: data.group || groupName,
          manager: user.surname,
          managerId: +user.id,
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
