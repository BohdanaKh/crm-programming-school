import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Roles } from '../common/decorators';
import { BearerAuthGuard, RoleGuard } from '../common/guards';
import { ApiPaginatedResponse, PaginatedDto } from '../common/pagination';
import { PublicUserInfoDto } from '../common/query';
import { PublicUserData } from './models/interface';
import { UserCreateRequestDto, UserUpdateRequestDto } from './models/request';
import { UserResponseDto } from './models/response';
import { UserMapper } from './users.mapper';
import { UserService } from './users.service';

@ApiTags('User')
@ApiExtraModels(PublicUserData, PaginatedDto)
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({ status: HttpStatus.CREATED, type: UserCreateRequestDto })
  @Roles('admin')
  @UseGuards(BearerAuthGuard, RoleGuard)
  @Post('create')
  async createUser(
    @Body() body: UserCreateRequestDto,
  ): Promise<UserResponseDto> {
    const newUser = await this.userService.createUserByAdmin(body);
    return UserMapper.toResponseDto(newUser);
  }

  @ApiPaginatedResponse('entities', PublicUserData)
  @Roles('admin', 'manager')
  @UseGuards(BearerAuthGuard, RoleGuard)
  @Get()
  async findAll(
    @Query() query: PublicUserInfoDto,
  ): Promise<PaginatedDto<UserResponseDto>> {
    return this.userService.getAllUsers(query);
  }

  @Roles('admin')
  @UseGuards(BearerAuthGuard, RoleGuard)
  @Post('ban/:userId')
  async banUser(@Param('userId') userId: string): Promise<void> {
    await this.userService.banUser(userId);
  }

  @Roles('admin')
  @UseGuards(BearerAuthGuard, RoleGuard)
  @Post('unban/:userId')
  async unbanUser(@Param('userId') userId: string): Promise<void> {
    await this.userService.unbanUser(userId);
  }

  @Roles('admin', 'manager')
  @UseGuards(BearerAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    const result = await this.userService.getUserById(id);
    return UserMapper.toResponseDto(result);
  }

  @Roles('admin')
  @UseGuards(BearerAuthGuard, RoleGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UserUpdateRequestDto,
  ): Promise<UserResponseDto> {
    const updatedUser = await this.userService.update(id, data);
    return UserMapper.toResponseDto(updatedUser);
  }

  @ApiOperation({
    description: 'Deleting a user',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('admin')
  @UseGuards(BearerAuthGuard, RoleGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.userService.remove(id);
  }
}
