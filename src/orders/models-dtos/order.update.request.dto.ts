import { ApiProperty } from '@nestjs/swagger';
import { Course, CourseFormat, CourseType, Status } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

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
  @IsEmail()
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
  @IsEnum(Status)
  @IsOptional()
  status: Status;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  sum: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  already_paid: number;

  @ApiProperty()
  @IsEnum(Course)
  @IsOptional()
  course: Course;

  @ApiProperty()
  @IsEnum(CourseFormat)
  @IsOptional()
  course_format: CourseFormat;

  @ApiProperty()
  @IsEnum(CourseType)
  @IsOptional()
  course_type: CourseType;

  @ApiProperty()
  @IsString()
  @IsOptional()
  utm: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  msg: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  manager: string;
}
