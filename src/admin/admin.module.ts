import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    // AuthModule,
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_SECRET_KEY,
        signOptions: {
          expiresIn: process.env.JWT_TTL,
        },
        verifyOptions: {
          clockTolerance: 60,
          maxAge: process.env.JWT_TTL,
        },
      }),
    }),],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
