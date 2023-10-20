import { UserResponseDto } from '../../../users/models/response';
import { AuthTokenResponseDto } from './auth-token.response.dto';

export class LoginResponseDto {
  token: AuthTokenResponseDto;

  user: UserResponseDto;
}
