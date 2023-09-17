import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  // IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class UserCreateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

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
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  surname: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  is_active: boolean;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  last_login: Date;

  // @ApiProperty()
  // @IsEnum(Role)
  // @IsNotEmpty()
  // role: Role;
}
