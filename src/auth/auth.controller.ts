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

// import { InjectRedisClient, RedisClient } from '@webeleon/nestjs-redis';
import { Roles } from '../common/decorators';
import { BearerAuthGuard, LogoutGuard, RoleGuard } from '../common/guards';
import { UserService } from '../users/users.service';
import { TokenType } from './models_dtos/enums';
import {
  ActivateUserDto,
  RefreshTokenRequestDto,
  UserLoginDto,
} from './models_dtos/request';
import { LoginResponseDto } from './models_dtos/response';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';

@ApiTags('Login')
@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private tokenService: TokenService, // @InjectRedisClient() private redisClient: RedisClient,
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
  @Post('refresh')
  async getNewToken(
    @Body() refreshTokenDto: RefreshTokenRequestDto,
  ): Promise<LoginResponseDto> {
    // const refreshToken = await this.redisClient.get(`refreshToken:${userId}`);
    // console.log(refreshToken);
    // if (!refreshToken) {
    //   throw new UnauthorizedException('No tokens found');
    // }
    const { refreshToken } = refreshTokenDto;
    return this.authService.renewAccess(refreshToken);
  }

  @ApiBearerAuth()
  @ApiOperation({ description: 'Activation of user account' })
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(BearerAuthGuard, RoleGuard)
  @Post('users/activate/:userId')
  async activateUserByAdmin(@Param('userId') userId: string): Promise<string> {
    return this.authService.generateActivationToken(userId);
  }
  @ApiOperation({ description: 'Password recovery' })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @Roles('admin')
  @UseGuards(BearerAuthGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Post('users/recovery/:userId')
  async recoveryPasswordByAdmin(
    @Param('userId') userId: string,
  ): Promise<string> {
    return await this.authService.generateRecoveryToken(userId);
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
