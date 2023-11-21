import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class OrderUpdateRequestDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  group: string;

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
  phone: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  age: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  status: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sum: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  already_paid: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  course: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  course_format: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  course_type: string;
}
