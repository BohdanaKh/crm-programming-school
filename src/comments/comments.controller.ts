import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JWTPayload } from '../auth/models_dtos/interface';
import { CurrentUser, Roles } from '../common/decorators';
import { BearerAuthGuard, RoleGuard } from '../common/guards';
import { CommentsService } from './comments.service';

@ApiTags('Comments')
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
  ): Promise<void> {
    await this.commentsService.createComment(user, orderId, comment);
  }

  // @Roles('admin', 'manager')
  // @UseGuards(BearerAuthGuard, RoleGuard)
  // @Get(':orderId')
  // async getCommentsByOrderId(
  //   @Param('orderId') orderId: string,
  // ): Promise<Comment[]> {
  //   return await this.commentsService.getCommentsByOrderId(orderId);
  // }
}
