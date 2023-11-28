import { ApiProperty } from '@nestjs/swagger';
import { Course, CourseFormat, CourseType, Status } from '@prisma/client';
import { IsIn, IsOptional, IsString } from 'class-validator';

import { IsRegexMatch } from '../../common/decorators';

export class OrderUpdateRequestDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  group: string | null;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsRegexMatch(/^[a-zA-Zа-щА-ЩЬьЮюЯяЇїІіЄєҐґ'\s-]+$/, {
    message:
      'Name may contain only Latin letters, Ukrainian letters, hyphen, apostrophe and whitespace.',
  })
  name: string | null;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsRegexMatch(/^[a-zA-Zа-щА-ЩЬьЮюЯяЇїІіЄєҐґ'\s-]+$/, {
    message:
      'Surname may contain only Latin letters, Ukrainian letters, hyphen, apostrophe and whitespace.',
  })
  surname: string | null;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsRegexMatch(
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    { message: 'Email is not valid' },
  )
  email: string | null | '';

  @ApiProperty()
  @IsString()
  @IsRegexMatch(
    /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/,
    {
      message:
        'Phone number may contain only digits and phone specific symbols',
    },
  )
  @IsOptional()
  phone: string | null;

  @ApiProperty()
  @IsOptional()
  @IsRegexMatch(/^(0|[1-9][0-9]?|100)$/, {
    message: 'Age must be a number from 1 to 100',
  })
  age: number | null | '';

  @ApiProperty()
  @IsOptional()
  @IsIn([...Object.values(Status), null, ''], {
    message: `Status must be: ${Status.New}, ${Status.In_work}, ${Status.Aggre}, ${Status.Disaggre}, ${Status.Dubbing} or null`,
  })
  @IsString()
  status: string | null;

  @ApiProperty()
  @IsOptional()
  @IsRegexMatch(/^\d*\.?\d+$/, {
    message:
      'Sum consists only of positive numbers (including integers and decimals)',
  })
  sum: number | null | '';

  @ApiProperty()
  @IsOptional()
  @IsRegexMatch(/^\d*\.?\d+$/, {
    message:
      'alreadyPaid sum consists only of positive numbers (including integers and decimals)',
  })
  alreadyPaid: number | null | '';

  @ApiProperty()
  @IsOptional()
  @IsIn([...Object.values(Course), '', null], {
    message: `Course must be: ${Course.FS}, ${Course.JCX}, ${Course.JSCX}, ${Course.FE}, ${Course.JSCX}, ${Course.QACX} or null`,
  })
  @IsString()
  course: string | null;

  @ApiProperty()
  @IsOptional()
  @IsIn([...Object.values(CourseFormat), '', null], {
    message: `Course format must be: ${CourseFormat.static}, ${CourseFormat.online} or null`,
  })
  @IsString()
  course_format: string | null;

  @ApiProperty()
  @IsOptional()
  @IsIn([...Object.values(CourseType), null, ''], {
    message: `Course type must be: ${CourseType.minimal}, ${CourseType.pro},  ${CourseType.premium}, ${CourseType.vip}, ${CourseType.incubator} or null`,
  })
  @IsString()
  course_type: string | null;
}
