import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { Prisma, User } from '@prisma/client';

import {
  ApiPaginatedResponse,
  PaginatedDto,
} from '../common/pagination/response';
import { PublicUserInfoDto } from '../common/query/user.query.dto';
import { UserCreateDto } from './dto/user.create.dto';
import { PublicUserData } from './interface/user.interface';
import { UserService } from './users.service';

// @ApiBearerAuth()
// @UseGuards(AuthGuard())
@ApiTags('User')
@ApiExtraModels(PublicUserData, PaginatedDto)
// @ApiBearerAuth()
// @UseGuards(AuthGuard())
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @ApiResponse({ status: HttpStatus.CREATED, type: UserCreateDto })
  @Post('create')
  //   // if (!req.userAbility.can('create', 'User')) {
  //   //   throw new HttpException('Forbidden resource', 403);
  //   // }
  async createUser(
    @Req() req: any,
    @Body() body: UserCreateDto,
    @Res() res: any,
  ) {
    const newUser = await this.userService.createUserByAdmin(body);
    return res
      .status(HttpStatus.CREATED)
      .json(
        newUser.id,
        newUser.name,
        newUser.surname,
        newUser.email,
        newUser.is_active,
        newUser.is_banned,
        newUser.last_login,
        newUser.created_at,
      );
  }

  @ApiPaginatedResponse('entities', PublicUserData)
  @Get()
  async findAll(@Query() query: PublicUserInfoDto) {
    return this.userService.getAllUsers(query);
  }

  @Post('ban/:userId')
  async banUser(@Param('userId') userId: string): Promise<void> {
    await this.userService.banUser(+userId);
    // return { message: 'User banned successfully' };
  }

  @Delete('unban/:userId')
  async unbanUser(@Param('userId') userId: string): Promise<void> {
    await this.userService.unbanUser(+userId);
    // return { message: 'User unbanned successfully' };
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.getUserById(id);
  }

  // @Put(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateUserDto: Prisma.UserUpdateInput,
  // ): Promise<User> {
  //   return this.userService.update(id, updateUserDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<User> {
    return this.userService.remove(id);
  }
}
