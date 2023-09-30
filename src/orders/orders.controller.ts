import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Orders, Prisma } from '@prisma/client';

import { PublicOrderInfoDto } from '../common/query/order.query.dto';
// import { Order } from '@prisma/client';
import { OrdersService } from './orders.service';

// @ApiBearerAuth()
// @UseGuards(AuthGuard())
@ApiTags('Orders')
@UseGuards(AuthGuard())
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAll(@Query() query: PublicOrderInfoDto) {
    return this.ordersService.findAllWithPagination(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Orders> {
    return this.ordersService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: Prisma.OrdersUpdateInput,
  ): Promise<Orders> {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Orders> {
    return this.ordersService.remove(+id);
  }
}
