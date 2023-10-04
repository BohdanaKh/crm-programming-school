import { ApiProperty } from '@nestjs/swagger';

export class PublicUserData {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  surname: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  is_active: boolean;

  @ApiProperty()
  last_login: Date;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  role: string;
}
