import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { TokenService } from '../auth/services/token.service';
import { PrismaService } from '../common/orm/prisma.service';
import { AppConfigModule } from '../config/config.module';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';

@Module({
  imports: [AppConfigModule],
  controllers: [GroupsController],
  providers: [GroupsService, PrismaService, JwtService, TokenService],
})
export class GroupsModule {}
