import { ConfigService, registerAs } from '@nestjs/config';

const configService = new ConfigService();
const configToken = 'app';
export default registerAs(configToken, () => ({
  accessTokenSecret: configService.get<string>('AUTH_ACCESS_TOKEN_SECRET'),
  refreshTokenSecret: configService.get<string>('AUTH_REFRESH_TOKEN_SECRET'),
  activateTokenSecret: configService.get<string>('ACTIVATE_TOKEN_SECRET'),
  recoveryTokenSecret: configService.get<string>('RECOVERY_TOKEN_SECRET'),
  accessTokenExpiration: configService.get<string>(
    'AUTH_ACCESS_TOKEN_EXPIRATION',
  ),
  refreshTokenExpiration: configService.get<string>(
    'AUTH_REFRESH_TOKEN_EXPIRATION',
  ),
  activationTokenExpiration: configService.get<string>(
    'ACTIVATE_TOKEN_EXPIRATION',
  ),
  recoveryTokenExpiration: configService.get<string>(
    'RECOVERY_TOKEN_EXPIRATION',
  ),
}));
