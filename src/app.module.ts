import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// import { RedisModule } from '@webeleon/nestjs-redis';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PassportWrapperModule } from './auth/passport-wrapper.module';
import { CommentsModule } from './comments/comments.module';
import { PrismaService } from './common/orm/prisma.service';
import { AppConfigModule } from './config/config.module';
import configuration from './config/configuration';
import { GroupsModule } from './groups/groups.module';
import { OrdersModule } from './orders/orders.module';
import { UserModule } from './users/users.module';

@Module({
  imports: [
    AppConfigModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    // RedisModule.forRoot({
    //   url: process.env.REDIS_URL,
    // }),
    AuthModule,
    OrdersModule,
    UserModule,
    CommentsModule,
    PassportWrapperModule,
    AdminModule,
    CommentsModule,
    GroupsModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
