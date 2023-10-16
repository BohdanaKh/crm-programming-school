import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Roles } from '../common/decorators/roles.decorator';
import { RoleGuard } from '../common/guards/role.guard';
import { AdminService } from './admin.service';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('adminPanel')
export class AdminController {
  constructor(private adminService: AdminService) {}
  @Roles('admin')
  @UseGuards(AuthGuard(), RoleGuard)
  @Get()
  async getAdminPanel() {
    return await this.adminService.getOrdersCounts();
  }
}
