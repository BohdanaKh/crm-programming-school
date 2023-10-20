import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { TokenService } from '../auth/services/token.service';
import { PrismaService } from '../common/orm/prisma.service';
import { AppConfigModule } from '../config/config.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [AppConfigModule],
  providers: [AdminService, JwtService, PrismaService, TokenService],
  controllers: [AdminController],
})
export class AdminModule {}
