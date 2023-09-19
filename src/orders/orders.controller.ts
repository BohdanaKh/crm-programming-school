import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
// import { Order } from '@prisma/client';

import { OrdersService } from './orders.service';
import { ApiTags } from "@nestjs/swagger";
import { PublicOrderInfoDto } from "../common/query/order.query.dto";

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAll(@Query() query: PublicOrderInfoDto) {
    return this.ordersService.findAllWithPagination(query);
  }
}
