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
import { TokenType } from './models_dtos/enums';
import { ActivateUserDto, UserLoginDto } from './models_dtos/request';
import { LoginResponseDto } from './models_dtos/response';
import { AuthTokenResponseDto } from './models_dtos/response/auth-token.response.dto';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';

@ApiTags('Login')
@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private tokenService: TokenService,
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

  @ApiOperation({ description: 'Renew access' })
  @Post('refresh/:userId')
  async getNewToken(
    @Param('userId') userId: string,
  ): Promise<AuthTokenResponseDto> {
    return this.authService.renewAccess(userId);
  }

  @ApiBearerAuth()
  @ApiOperation({ description: 'Activation of user account' })
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(BearerAuthGuard, RoleGuard)
  @Post('activate/:userId')
  async activateUserByAdmin(@Param('userId') userId: string): Promise<void> {
    await this.authService.generateActivationTokenUrl(userId);
  }
  @ApiOperation({ description: 'Password recovery' })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @Roles('admin')
  @UseGuards(BearerAuthGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Post('recovery/:userId')
  async recoveryPasswordByAdmin(
    @Param('userId') userId: string,
  ): Promise<void> {
    await this.authService.generateRecoveryTokenUrl(userId);
  }

  @ApiOperation({ description: 'Activation account by user' })
  @HttpCode(HttpStatus.OK)
  @Put('activate/:activationToken')
  async activateUserByUser(
    @Param('activationToken') activationToken: string,
    @Body() body: ActivateUserDto,
  ): Promise<void> {
    const jwtPayload = await this.tokenService.verifyToken(
      activationToken,
      TokenType.Activate,
    );
    const { id } = jwtPayload;
    await this.userService.getUserById(id);
    return await this.userService.activateUserByUser(id, body);
  }
  @ApiOperation({ description: 'Recovery password by user' })
  @HttpCode(HttpStatus.OK)
  @Put('recovery/:recoveryToken')
  async recoveryPasswordByUser(
    @Param('recoveryToken') recoveryToken: string,
    @Body() body: ActivateUserDto,
  ): Promise<void> {
    const jwtPayload = await this.tokenService.verifyToken(
      recoveryToken,
      TokenType.Recovery,
    );
    const { id } = jwtPayload;
    await this.userService.getUserById(id);
    return await this.userService.activateUserByUser(id, body);
  }
}
