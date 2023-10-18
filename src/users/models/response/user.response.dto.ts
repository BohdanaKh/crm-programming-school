import { Orders } from '@prisma/client';

export class UserResponseDto {
  id: number;

  email: string;

  name: string;

  surname: string;

  is_active: boolean;

  last_login: string;
}

export class UsersWithOrdersResponseDTO extends UserResponseDto {
  orders: Orders[];
}
