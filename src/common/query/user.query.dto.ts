import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class PublicUserInfoDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsEnum(['email', 'name', 'surname', 'last_login', 'created_at'])
  sort: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  order: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  search: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  page: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  limit: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  surname: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  email: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  is_active: boolean;
}
