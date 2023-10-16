import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Comment } from '@prisma/client';

import { JWTPayload } from '../auth/models_dtos/interface';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { BearerAuthGuard } from '../common/guards/bearer-auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Roles('admin', 'manager')
  @UseGuards(BearerAuthGuard, RoleGuard)
  @Post(':orderId')
  async createComment(
    @CurrentUser() user: JWTPayload,
    @Param('orderId') orderId: string,
    @Body('comment') comment: string,
  ): Promise<Comment> {
    return await this.commentsService.createComment(user, orderId, comment);
  }

  @Roles('admin', 'manager')
  @UseGuards(BearerAuthGuard, RoleGuard)
  @Get(':orderId')
  async getCommentsByOrderId(
    @Param('orderId') orderId: string,
  ): Promise<Comment[]> {
    return await this.commentsService.getCommentsByOrderId(orderId);
  }
}
