import { ForbiddenException, Injectable } from '@nestjs/common';
import { Orders } from '@prisma/client';

import { JWTPayload } from '../auth/models_dtos/interface';
import { CurrentUser } from '../common/decorators';
import { ApiError } from '../common/errors';
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
          manager ? { manager } : undefined,
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
    return this.prisma.orders.findUnique({
      where: { id: +orderId },
      include: {
        comments: true,
      },
    });
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
    @CurrentUser() user: JWTPayload,
    orderId: string,
    data: OrderUpdateRequestDto,
  ): Promise<Orders> {
    // const findUser = await this.userService.getUserById(user.id);
    const findOrder = await this.prisma.orders.findUnique({
      where: { id: +orderId },
    });
    if (!(findOrder.managerId === +user.id)) {
      throw new ForbiddenException();
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
        },
      });
    } catch (error) {
      throw new ApiError(`Order update failed for ID ${orderId}`, error.status);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.orders.delete({
        where: { id: +id },
      });
    } catch (error) {
      throw new ApiError(`Order deletion failed for ID ${id}`, error.status);
    }
  }
}
