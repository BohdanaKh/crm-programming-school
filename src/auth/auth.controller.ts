import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Roles } from '../common/decorators';
import { BearerAuthGuard, LogoutGuard, RoleGuard } from '../common/guards';
import { UserService } from '../users/users.service';
import { AuthService } from './auth.service';
import { EActionTokenTypes } from './models_dtos/enums';
import { ActivateUserDto, UserLoginDto } from './models_dtos/request';
import { LoginResponseDto } from './models_dtos/response';

@ApiTags('Login')
@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @ApiOperation({ description: 'User authentication' })
  @Post('login')
  async login(@Body() loginUser: UserLoginDto): Promise<LoginResponseDto> {
    return await this.authService.login(loginUser);
  }

  @UseGuards(BearerAuthGuard, LogoutGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(): Promise<string> {
    return 'Logout';
  }

  @ApiBearerAuth()
  @ApiOperation({ description: 'Activation user account by admin' })
  @Roles('admin')
  @UseGuards(BearerAuthGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Post('activate/:userId')
  async activateUserByAdmin(@Param('userId') userId: string): Promise<void> {
    await this.authService.generateActivationTokenUrl(
      userId,
      EActionTokenTypes.Activate,
    );
  }

  @ApiOperation({ description: 'Activation account by user' })
  @HttpCode(HttpStatus.OK)
  @Put('activate/:activationToken')
  async activateUserByUser(
    @Param('activationToken') activationToken: string,
    @Body() body: ActivateUserDto,
  ): Promise<void> {
    const jwtPayload = await this.authService.verify(activationToken);
    const { id } = jwtPayload;
    await this.userService.getUserById(id);
    return await this.userService.activateUserByUser(id, body);
  }
  @ApiBearerAuth()
  @Roles('admin')
  @UseGuards(BearerAuthGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Post('recovery/:userId')
  async recoveryPassword(@Param('userId') userId: string): Promise<void> {
    await this.authService.generateActivationTokenUrl(
      userId,
      EActionTokenTypes.Recovery,
    );
  }
}
