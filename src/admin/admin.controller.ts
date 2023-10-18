import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Roles } from '../common/decorators';
import { BearerAuthGuard, RoleGuard } from '../common/guards';
import { AdminService } from './admin.service';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('adminPanel')
export class AdminController {
  constructor(private adminService: AdminService) {}
  @Roles('admin')
  @UseGuards(BearerAuthGuard, RoleGuard)
  @Get()
  async getAdminPanel() {
    return await this.adminService.getOrdersCounts();
  }
}
