import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class PublicOrderInfoDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsEnum(['created_at'])
  sort: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  order: 'ASC' | 'DESC';

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

  // @ApiProperty()
  // @IsString()
  // @IsOptional()
  // status: string;
  //
  // @ApiProperty()
  // @IsString()
  // @IsOptional()
  // brand: string;
  //
  // @ApiProperty()
  // @IsString()
  // @IsOptional()
  // region: string;
  //
  // @ApiProperty()
  // @IsString()
  // @IsOptional()
  // categories: string;
}
