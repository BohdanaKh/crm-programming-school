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
} from 'class-validator';

export class UserCreateRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
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
  is_active: boolean;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  last_login: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  is_banned: boolean;

  @ApiProperty()
  @IsEnum(Role)
  @IsOptional()
  role: Role;
}
