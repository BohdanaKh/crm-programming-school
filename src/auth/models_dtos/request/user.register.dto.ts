import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

import { Match } from '../../../common/decorators';

export class ActivateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      'The password must contain at least 8 characters, including at least one letter, one digit, and one special character (@, $, !, %, *, #, ?, or &).',
  })
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Match('password')
  confirm_password: string;
}
