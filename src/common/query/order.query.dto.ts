import { ApiProperty } from '@nestjs/swagger';
import { Course, CourseFormat, CourseType, Status } from '@prisma/client';
import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';

import { IsRegexMatch } from '../decorators';

export class PublicOrderInfoDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsEnum([
    'id',
    'name',
    'surname',
    'email',
    'phone',
    'age',
    'course',
    'course_format',
    'course_type',
    'status',
    'sum',
    'alreadyPaid',
    'created_at',
    'group',
    'manager',
    '-id',
    '-name',
    '-surname',
    '-email',
    '-phone',
    '-age',
    '-course',
    '-course_format',
    '-course_type',
    '-status',
    '-sum',
    '-alreadyPaid',
    '-created_at',
    '-group',
    '-manager',
  ])
  sort: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  search: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsRegexMatch(/^([1-9]|1\d|20)$/, {
    message: 'Page must be from 1 to 20',
  })
  page: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsRegexMatch(/^([1-9]|[1-9]\d{0,2}|[1-4]\d{2}|500)$/, {
    message: 'Limit must be from 1 to 500',
  })
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
  phone: string;

  @ApiProperty()
  @IsString()
  @Matches(/^[0-9]+$/, {
    message: 'Age must consist of positive numbers',
  })
  @IsOptional()
  age: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsEnum(Course)
  course: Course;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsEnum(CourseFormat)
  course_format: CourseFormat;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsEnum(CourseType)
  course_type: CourseType;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsEnum(Status)
  status: Status;

  @ApiProperty()
  @IsString()
  @IsOptional()
  group: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  manager: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Matches(/^[0-9]+$/, {
    message: 'Id must consist of positive numbers',
  })
  managerId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsRegexMatch(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[01])$/, {
    message: 'Date must be in YYYY-MM-DD format',
  })
  start_date: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsRegexMatch(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[01])$/, {
    message: 'Date must be in YYYY-MM-DD format',
  })
  end_date: string;
}
