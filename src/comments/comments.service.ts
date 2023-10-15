import { Injectable } from '@nestjs/common';
import { Comment } from '@prisma/client';

import { PrismaService } from '../common/orm/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async createComment(
    userId: string,
    orderId: string,
    comment: string,
  ): Promise<Comment> {
    return this.prisma.comment.create({
      data: {
        comment,
        userId: +userId,
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
