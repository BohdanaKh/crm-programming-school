import {
  Body,
  Controller,
  Delete,
  Get, HttpStatus,
  Param,
  Post,
  Put,
  Query, Req, Res,
  UseGuards
} from "@nestjs/common";
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Prisma, User } from '@prisma/client';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
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
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)

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
    return res
      .status(HttpStatus.CREATED)
      .json(await this.userService.createUserByAdmin(body));
  }

  @Post('activate')

  @ApiPaginatedResponse('entities', PublicUserData)
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query() query: PublicUserInfoDto) {
    return this.userService.getAllUsers(query);
  }
  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.getUserById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: Prisma.UserUpdateInput,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<User> {
    return this.userService.remove(id);
  }
}
