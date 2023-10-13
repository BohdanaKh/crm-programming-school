import { ApiProperty } from '@nestjs/swagger';
import { Course, CourseFormat, CourseType, Status } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

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
  ])
  sort: string;

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
  // @IsEnum([
  //   'name',
  //   'surname',
  //   'email',
  //   'phone',
  //   'age',
  //   'course',
  //   'course_format',
  //   'course_type',
  //   'status',
  // ])
  // filter: string;

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
  age: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsEnum(Course)
  course: Course;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsEnum(['static', 'online'])
  courseFormat: CourseFormat;

  @ApiProperty()
  @IsString()
  @IsOptional()
  courseType: CourseType;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsEnum(Status)
  status: Status;

  @ApiProperty()
  @IsString()
  @IsOptional()
  group: string;
}
