import { Module } from '@nestjs/common';

import { PrismaService } from '../common/orm/prisma.service';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { JwtService } from "@nestjs/jwt";

@Module({
  providers: [UserService, PrismaService, JwtService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
