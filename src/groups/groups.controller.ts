import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
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

  @ApiOperation({
    description: 'Deleting a group',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('admin')
  @UseGuards(BearerAuthGuard, RoleGuard)
  @Delete(':groupId')
  async remove(@Param('groupId') groupId: string): Promise<void> {
    await this.groupsService.remove(groupId);
  }
}
