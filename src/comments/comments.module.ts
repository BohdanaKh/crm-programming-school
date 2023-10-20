import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { TokenService } from '../auth/services/token.service';
import { PrismaService } from '../common/orm/prisma.service';
import { AppConfigModule } from '../config/config.module';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  imports: [AppConfigModule],
  controllers: [CommentsController],
  providers: [CommentsService, PrismaService, JwtService, TokenService],
})
export class CommentsModule {}
