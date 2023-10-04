import { Module } from '@nestjs/common';

import { PrismaService } from '../common/orm/prisma.service';
import { UserController } from './users.controller';
import { UserService } from './users.service';

@Module({
  providers: [UserService, PrismaService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
