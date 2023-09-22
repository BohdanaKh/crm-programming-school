import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  IsBoolean,
  IsDate,
  IsEnum,
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
  @IsOptional()
  isActive: boolean;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  lastLogin: Date;

  @ApiProperty()
  @IsEnum(Role)
  @IsOptional()
  role: Role;
}
