import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { RoleGuard } from '../common/rbac/role.guard';
import { Roles } from '../common/rbac/roles.decorator';

@ApiTags('Admin')
@ApiBearerAuth()
@Roles('admin')
@UseGuards(AuthGuard(), RoleGuard)
@Controller('adminPanel')
export class AdminController {
  constructor() {}
  @Get()
  async getAdminPanel() {
    return 'Admin Panel';
  }
}
