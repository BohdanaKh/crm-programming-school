import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Roles } from '../common/decorators/roles.decorator';
import { BearerAuthGuard } from '../common/guards/bearer-auth.guard';
import { RoleGuard } from '../common/guards/role.guard';

@ApiTags('Admin')
@ApiBearerAuth()

@Controller('adminPanel')
export class AdminController {
  constructor() {}
  @Roles('admin')
  @UseGuards(AuthGuard(), RoleGuard)
  @Get()
  async getAdminPanel() {
    return 'Admin Panel';
  }
}
