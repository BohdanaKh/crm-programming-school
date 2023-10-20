import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';

import { AppConfigModule } from '../config/config.module';
import configuration from '../config/configuration';
import { AppConfigService } from '../config/configuration.service';
import { MailService } from './mail/mail.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MailerModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: (configService: AppConfigService) => ({
        transport: {
          host: configService.host,
          port: configService.port,
          secure: true,
          auth: {
            type: 'login',
            user: configService.emailUser,
            pass: configService.emailPassword,
          },
        },
        defaults: {
          from: '"CRM Programming school" <no-reply@example.com>',
        },
        preview: false,
        template: {
          dir: path.join(__dirname, '..', '..', '/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [AppConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
