import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Status } from '@prisma/client';

import { JWTPayload } from '../auth/models_dtos/interface';
import { PrismaService } from '../common/orm/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async createComment(
    user: JWTPayload,
    orderId: string,
    comment: string,
  ): Promise<void> {
    const orderToUpdate = await this.prisma.orders.findUnique({
      where: { id: +orderId },
    });
    if (!orderToUpdate) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
    if (orderToUpdate.managerId && orderToUpdate.managerId !== +user.id) {
      throw new ForbiddenException(
        `Order with ID ${orderId} is already being processed by another manager`,
      );
    }
    try {
      await this.prisma.comment.create({
        data: {
          comment,
          userId: +user.id,
          orderId: +orderId,
        },
      });
    } catch (e) {
      throw new BadRequestException('Comment creation failed');
    }
    let newStatus: Status;
    if (orderToUpdate.status === Status.New || orderToUpdate.status === null) {
      newStatus = Status.In_work;
    } else {
      newStatus = orderToUpdate.status;
    }
    await this.prisma.orders.update({
      where: { id: +orderId },
      data: { managerId: +user.id, manager: user.surname, status: newStatus },
    });
  }

  // async getCommentsByOrderId(orderId: string): Promise<Comment[]> {
  //   return this.prisma.comment.findMany({
  //     where: { orderId: +orderId },
  //   });
  // }
}
