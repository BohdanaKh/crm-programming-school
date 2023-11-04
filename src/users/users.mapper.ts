import { User } from '@prisma/client';

// import * as dayjs from 'dayjs';
import { IUserData } from '../common/models/interfaces';
import { UserResponseDto } from './models/response';

export class UserMapper {
  public static toResponseDto(user: User): UserResponseDto {
    // const creationDate = dayjs(user.created_at).format('MMMM DD, YYYY');
    return {
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      is_active: user.is_active,
      created_at: user.created_at,
      last_login: user.last_login,
      role: user.role,
    };
  }

  public static toUserData(user: User): IUserData {
    return {
      userId: user.id.toString(),
    };
  }
}
