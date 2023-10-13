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

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { IUserData } from '../common/models/interfaces';
import { PaginatedDto } from '../common/pagination/response';
import { PublicOrderInfoDto } from '../common/query/order.query.dto';
import { OrderUpdateRequestDto } from './models-dtos/order.update.request.dto';
import { OrdersService } from './orders.service';

// @ApiBearerAuth()
// @UseGuards(AuthGuard())
@ApiTags('Orders')
// @ApiBearerAuth()
// @UseGuards(AuthGuard())
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAll(
    @Query() query: PublicOrderInfoDto,
  ): Promise<PaginatedDto<Orders>> {
    return this.ordersService.findAllWithPagination(query);
  }

  @Get(':orderId')
  async findOne(@Param('orderId') orderId: string): Promise<Orders> {
    return this.ordersService.findOne(orderId);
  }

  @ApiOperation({
    description: 'Updating an order',
  })
  // @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':orderId')
  async update(
    @CurrentUser() user: IUserData,
    @Param('orderId') orderId: string,
    // @Body() updateOrderDto: OrderUpdateRequestDto,
  ): Promise<Orders> {
    return await this.ordersService.update(
      user.userId,
      orderId,
      // updateOrderDto,
    );
  }

  @ApiOperation({
    description: 'Deleting an order',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.ordersService.remove(+id);
  }
}
