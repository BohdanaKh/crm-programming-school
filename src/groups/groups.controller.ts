import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Group } from '@prisma/client';

import { Roles } from '../common/decorators';
import { RoleGuard } from '../common/guards';
import { GroupsService } from './groups.service';

@Controller('groups')
export class GroupsController {
  constructor(private groupsService: GroupsService) {}

  @Roles('admin', 'manager')
  @UseGuards(AuthGuard(), RoleGuard)
  @Get()
  async getListOfGroups(): Promise<Group[]> {
    return await this.groupsService.getAll();
  }

  @Roles('admin', 'manager')
  @UseGuards(AuthGuard(), RoleGuard)
  @Post('/create')
  async createGroup(
    // @Param('orderId') orderId: string,
    @Body('title') title: string,
  ): Promise<Group> {
    return await this.groupsService.create(title);
  }
}
