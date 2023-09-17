import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
// import { Order } from '@prisma/client';

import { OrdersService } from './orders.service';
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAll(
    @Query('page', ParseIntPipe) page: number,
    // @Query('perPage', ParseIntPipe) perPage: number,
  ) {
    return this.ordersService.findAllWithPagination(page);
  }
}
