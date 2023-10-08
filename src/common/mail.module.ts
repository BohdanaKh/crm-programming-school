import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';
// import * as process from 'process';

import { MailService } from './mail/mail.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          type: 'login',
          // user: process.env.EMAIL_USER,
          // pass: process.env.EMAIL_PASSWORD,
          user: 'dananvm@gmail.com',
          pass: 'zvxd xorm nirj svwm',
        },
      },
      defaults: {
        from: '"CRM Programming school" <no-reply@example.com>',
      },
      preview: false,
      template: {
        dir: path.join(__dirname, '..', '/email-templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
