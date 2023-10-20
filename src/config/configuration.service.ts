import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import configuration from './configuration';

@Injectable()
export class AppConfigService {
  constructor(
    @Inject(configuration.KEY)
    private appConfiguration: ConfigType<typeof configuration>,
  ) {}

  get accessTokenSecret(): string {
    return this.appConfiguration.accessTokenSecret;
  }

  get accessTokenExpiration(): string {
    return this.appConfiguration.accessTokenExpiration;
  }

  get refreshTokenSecret(): string {
    return this.appConfiguration.refreshTokenSecret;
  }

  get refreshTokenExpiration(): string {
    return this.appConfiguration.refreshTokenExpiration;
  }

  get activationTokenSecret(): string {
    return this.appConfiguration.activateTokenSecret;
  }

  get activationTokenExpiration(): string {
    return this.appConfiguration.activationTokenExpiration;
  }

  get recoveryTokenSecret(): string {
    return this.appConfiguration.recoveryTokenSecret;
  }

  get recoveryTokenExpiration(): string {
    return this.appConfiguration.recoveryTokenExpiration;
  }
  get emailUser(): string {
    return this.appConfiguration.emailUser;
  }
  get emailPassword(): string {
    return this.appConfiguration.emailPassword;
  }

  get port(): number {
    return Number(this.appConfiguration.port);
  }

  get host(): string {
    return this.appConfiguration.host;
  }
}
