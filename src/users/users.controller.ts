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
import { User } from '@prisma/client';

import {
  ApiPaginatedResponse,
  PaginatedDto,
} from '../common/pagination/response';
import { PublicUserInfoDto } from '../common/query/user.query.dto';
import { PublicUserData } from './models/interface';
import { UserCreateRequestDto, UserUpdateRequestDto } from './models/request';
import { UserResponseDto } from './models/response';
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


  // @ApiResponse({ status: HttpStatus.CREATED, type: UserCreateRequestDto })
  @Post('create')
  //   // if (!req.userAbility.can('create', 'User')) {
  //   //   throw new HttpException('Forbidden resource', 403);
  //   // }
  async createUser(
    @Req() req: any,
    @Body() body: UserCreateRequestDto,
    @Res() res: any,
  ) {
    const newUser = await this.userService.createUserByAdmin(body);
    return (
      res
        .status(HttpStatus.CREATED)
        // .json(await this.userService.createUserByAdmin(body));
        .json({
          id: newUser.id,
          name: newUser.name,
          surname: newUser.surname,
          email: newUser.email,
          is_active: newUser.is_active,
          is_banned: newUser.is_banned,
          last_login: newUser.last_login,
          created_at: newUser.created_at,
        })
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

  @Post('unban/:userId')
  async unbanUser(@Param('userId') userId: string): Promise<void> {
    await this.userService.unbanUser(+userId);
    // return { message: 'User unbanned successfully' };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: any): Promise<User> {
    const foundUser = await this.userService.getUserById(id);
    return res.status(HttpStatus.OK).json({
      id: foundUser.id,
      name: foundUser.name,
      surname: foundUser.surname,
      email: foundUser.email,
      is_active: foundUser.is_active,
      is_banned: foundUser.is_banned,
      last_login: foundUser.last_login,
      created_at: foundUser.created_at,
    });
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UserUpdateRequestDto,
    @Res() res: any,
  ): Promise<User> {
    const updatedUser = await this.userService.update(id, data);
    return res.status(HttpStatus.OK).json({
      id: updatedUser.id,
      name: updatedUser.name,
      surname: updatedUser.surname,
      email: updatedUser.email,
      is_active: updatedUser.is_active,
      is_banned: updatedUser.is_banned,
      last_login: updatedUser.last_login,
      created_at: updatedUser.created_at,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: any): Promise<User> {
    await this.userService.remove(id);
    return res.status(HttpStatus.OK).json('User removed');
  }
}
