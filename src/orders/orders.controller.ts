import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Orders } from '@prisma/client';

import { JWTPayload } from '../auth/models_dtos/interface';
import { CurrentUser, Roles } from '../common/decorators';
import { BearerAuthGuard, RoleGuard } from '../common/guards';
import { PaginatedDto } from '../common/pagination';
import { PublicOrderInfoDto } from '../common/query';
import { OrderUpdateRequestDto } from './models-dtos';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Roles('admin', 'manager')
  @UseGuards(BearerAuthGuard, RoleGuard)
  @Get()
  async findAll(
    @Query() query: PublicOrderInfoDto,
  ): Promise<PaginatedDto<Orders>> {
    return this.ordersService.findAllWithPagination(query);
  }

  @Roles('admin', 'manager')
  @UseGuards(BearerAuthGuard, RoleGuard)
  @Get(':orderId')
  async getOrderWithComments(
    @Param('orderId') orderId: string,
  ): Promise<Orders> {
    return await this.ordersService.getOrderWithComments(orderId);
  }

  @ApiOperation({
    description: 'Updating an order',
  })
  @Roles('admin', 'manager')
  @UseGuards(AuthGuard(), RoleGuard)
  @Put(':orderId')
  async update(
    @CurrentUser() user: JWTPayload,
    @Param('orderId') orderId: string,
    @Body() body: OrderUpdateRequestDto,
  ): Promise<Orders> {
    return await this.ordersService.update(user, orderId, body);
  }

  @ApiOperation({
    description: 'Deleting an order',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('admin')
  @UseGuards(BearerAuthGuard, RoleGuard)
  @Delete(':orderId')
  async remove(@Param('orderId') orderId: string): Promise<void> {
    await this.ordersService.remove(orderId);
  }
}
