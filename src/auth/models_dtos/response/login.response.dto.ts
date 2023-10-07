import { UserResponseDto } from '../../../users/models/response';

export class LoginResponseDto {
  token: string;

  user: UserResponseDto;
}
