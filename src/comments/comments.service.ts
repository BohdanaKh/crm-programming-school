import { Injectable } from '@nestjs/common';
import { Comment } from '@prisma/client';

import { JWTPayload } from '../auth/models_dtos/interface';
import { PrismaService } from '../common/orm/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async createComment(
    user: JWTPayload,
    orderId: string,
    comment: string,
  ): Promise<Comment> {
    await this.prisma.orders.update({
      where: { id: +orderId },
      data: { managerId: +user.id, manager: user.surname },
    });
    return this.prisma.comment.create({
      data: {
        comment,
        userId: +user.id,
        orderId: +orderId,
      },
    });
  }

  async getCommentsByOrderId(orderId: string): Promise<Comment[]> {
    return this.prisma.comment.findMany({
      where: { orderId: +orderId },
    });
  }
}
