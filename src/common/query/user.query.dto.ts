import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class PublicUserInfoDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsEnum(['email', 'name', 'surname', 'isActive', 'lastLogin', 'createdAt'])
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

}
