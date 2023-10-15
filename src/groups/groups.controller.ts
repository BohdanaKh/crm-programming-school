import { Body, Controller, Get, Post } from "@nestjs/common";
import { Group } from "@prisma/client";

import { GroupsService } from './groups.service';


@Controller('groups')
export class GroupsController {
  constructor(private groupsService: GroupsService) {}
  @Get()
  async getListOfGroups(): Promise<Group[]> {
    return await this.groupsService.getAll();
  }

  @Post('/create')
  async createGroup(
    // @Param('orderId') orderId: string,
    @Body('title') title: string,
  ): Promise<Group> {
    return await this.groupsService.create(title);
  }
}
