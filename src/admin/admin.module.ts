import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, JwtService } from "@nestjs/jwt";

import { AuthModule } from '../auth/auth.module';
import { RoleGuard } from '../common/guards/role.guard';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PrismaService } from "../common/orm/prisma.service";

@Module({
  imports: [
    // AuthModule,
    // JwtModule.registerAsync({
    //   useFactory: async () => ({
    //     secret: process.env.JWT_SECRET_KEY,
    //     signOptions: {
    //       expiresIn: process.env.JWT_TTL,
    //     },
    //     verifyOptions: {
    //       clockTolerance: 60,
    //       maxAge: process.env.JWT_TTL,
    //     },
    //   }),
    // }),
  ],
  providers: [
    AdminService,
    JwtService,
    PrismaService,
  ],
  controllers: [AdminController],
})
export class AdminModule {}
