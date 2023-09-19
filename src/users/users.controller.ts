import { subject } from '@casl/ability';
import {
  Body,
  Controller,
  Get,
  HttpException,
  ParseIntPipe,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { User } from '@prisma/client';

import { PublicUserInfoDto } from '../common/query/user.query.dto';
import { UserCreateDto } from './dto/user.create.dto';
import { UserService } from './users.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //
  @Post()
  async createUser(@Req() req, @Body() userData: UserCreateDto): Promise<User> {
    if (!req.userAbility.can('create', 'User')) {
      throw new HttpException('Forbidden resource', 403);
    }
    return await this.userService.createUser(userData);
  }

  @Get()
  async findAll(@Query() query: PublicUserInfoDto) {
    return this.userService.getAllUsers(query);
  }
  //
  //   @Get()
  //   async getUserById(): Promise<User> {}
  //
  //   @Patch()
  //   async updateUser(): Promise<User> {}
  //   @Delete()
  //   async deleteUser(): Promise<void> {}
}
