import { Module } from '@nestjs/common';

import { PrismaService } from '../common/orm/prisma.service';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { JwtService } from "@nestjs/jwt";

@Module({
  controllers: [CommentsController],
  providers: [CommentsService, PrismaService, JwtService],
})
export class CommentsModule {}
