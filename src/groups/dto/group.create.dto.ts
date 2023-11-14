import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GroupCreateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;
}
