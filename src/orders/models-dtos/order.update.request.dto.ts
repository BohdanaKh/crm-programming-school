import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

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
  @IsNumber()
  @IsOptional()
  age: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  status: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  sum: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  already_paid: number;

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
