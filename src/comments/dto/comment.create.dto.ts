import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CommentCreateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  comment: string;
}
