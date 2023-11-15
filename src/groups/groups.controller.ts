import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Group } from '@prisma/client';

import { Roles } from '../common/decorators';
import { BearerAuthGuard, RoleGuard } from '../common/guards';
import { GroupCreateDto } from './dto';
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

  @Roles('admin', 'manager')
  @UseGuards(BearerAuthGuard, RoleGuard)
  @Post()
  async createGroup(@Body() group: GroupCreateDto): Promise<Group> {
    return await this.groupsService.create(group);
  }
}
