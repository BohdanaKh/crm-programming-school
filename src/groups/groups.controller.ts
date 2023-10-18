import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Group } from '@prisma/client';

import { Roles } from '../common/decorators';
import { BearerAuthGuard, RoleGuard } from '../common/guards';
import { GroupsService } from './groups.service';

@ApiTags('Groups')
@Controller('groups')
export class GroupsController {
  constructor(private groupsService: GroupsService) {}

  @Roles('admin', 'manager')
  @UseGuards(BearerAuthGuard, RoleGuard)
  @Get()
  async getListOfGroups(): Promise<Group[]> {
    return await this.groupsService.getAll();
  }

  // @Roles('admin', 'manager')
  // @UseGuards(BearerAuthGuard, RoleGuard)
  // @Post('/create')
  // async createGroup(
  //   // @Param('orderId') orderId: string,
  //   @Body('title') title: string,
  // ): Promise<Group> {
  //   return await this.groupsService.create(title);
  // }
}
