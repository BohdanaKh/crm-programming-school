import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AppConfigService } from '../../config/configuration.service';
import { TokenType } from '../models_dtos/enums';
import { TokenError } from '../models_dtos/enums/token-error';
import { JWTPayload } from '../models_dtos/interface';
import { ActivationTokenResponseDto } from '../models_dtos/response/activate-token.response.dto';
import { AuthTokenResponseDto } from '../models_dtos/response/auth-token.response.dto';
import { RecoveryTokenResponseDto } from '../models_dtos/response/recovery-token.response.dto';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: AppConfigService,
  ) {}

  public generateAuthToken(payload: JWTPayload): AuthTokenResponseDto {
    const accessTokenExpires = this.configService.accessTokenExpiration;
    const refreshTokenExpires = this.configService.refreshTokenExpiration;

    const accessToken = this.generateToken(
      payload,
      accessTokenExpires,
      TokenType.Access,
    );
    const refreshToken = this.generateToken(
      payload,
      refreshTokenExpires,
      TokenType.Refresh,
    );

    return {
      accessToken,
      accessTokenExpires,
      refreshToken,
      refreshTokenExpires,
    };
  }
  public async generateActivationToken(
    payload: JWTPayload,
  ): Promise<ActivationTokenResponseDto> {
    const activationTokenExpires = this.configService.activationTokenExpiration;
    const activationToken = this.generateToken(
      payload,
      activationTokenExpires,
      TokenType.Activate,
    );
    return {
      activationToken,
      activationTokenExpires,
    };
  }
  public generateRecoveryToken(payload: JWTPayload): RecoveryTokenResponseDto {
    const recoveryTokenExpires = this.configService.recoveryTokenExpiration;
    const recoveryToken = this.generateToken(
      payload,
      recoveryTokenExpires,
      TokenType.Recovery,
    );
    return {
      recoveryToken,
      recoveryTokenExpires,
    };
  }

  public async generateRefreshToken(
    refreshToken: string,
  ): Promise<AuthTokenResponseDto> {
    const { id, email, surname, role } = await this.verifyToken(
      refreshToken,
      TokenType.Refresh,
    );
    return this.generateAuthToken({ id, email, surname, role });
  }

  public async verifyToken(
    token: string,
    type: TokenType,
  ): Promise<JWTPayload> {
    try {
      const secret = this.getSecret(type);

      return await this.jwtService.verify(token, { secret });
    } catch (error) {
      const isAccessExpired =
        error.name === TokenError.TokenExpiredError &&
        type === TokenType.Access;
      if (isAccessExpired) {
        throw new UnauthorizedException('Access token has expired');
      }
      const isRefreshExpired =
        error.name === TokenError.TokenExpiredError &&
        type === TokenType.Refresh;
      if (isRefreshExpired) {
        throw new UnauthorizedException('Refresh token has expired');
      }

      const isActivationExpired =
        error.name === TokenError.TokenExpiredError &&
        type === TokenType.Activate;
      if (isActivationExpired) {
        throw new UnauthorizedException('Activation token has expired');
      }

      const isRecoveryExpired =
        error.name === TokenError.TokenExpiredError &&
        type === TokenType.Recovery;
      if (isRecoveryExpired) {
        throw new UnauthorizedException('Recovery token has expired');
      }

      throw new UnauthorizedException('Token is not valid');
    }
  }

  private generateToken(
    payload: JWTPayload,
    expiresIn: string,
    type: TokenType,
  ): string {
    const secret = this.getSecret(type);
    // this.configService.accessTokenSecret;
    return this.jwtService.sign(payload, { expiresIn, secret });
  }

  private getSecret(type: TokenType): string {
    switch (type) {
      case TokenType.Access:
        return this.configService.accessTokenSecret;
      case TokenType.Refresh:
        return this.configService.refreshTokenSecret;
      case TokenType.Activate:
        return this.configService.activationTokenSecret;
      case TokenType.Recovery:
        return this.configService.recoveryTokenSecret;
    }
  }
}
