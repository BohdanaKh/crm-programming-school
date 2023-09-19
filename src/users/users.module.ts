import { Module } from '@nestjs/common';

import { UserController } from './users.controller';
import { UserService } from "./users.service";
import { PrismaService } from "../common/orm/prisma.service";



@Module({
  providers: [UserService, PrismaService],
  controllers: [UserController],
})
export class UserModule {}
