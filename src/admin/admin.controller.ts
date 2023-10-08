import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Roles } from '../common/decorators/roles.decorator';
import { RoleGuard } from "../common/guards/role.guard";

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
