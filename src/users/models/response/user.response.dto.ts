import { Orders } from '@prisma/client';

export class UserResponseDto {
  id: number;

  email: string;

  name: string;

  surname: string;

  is_active: boolean;
  created_at: Date;

  last_login: string;
  role: string;
}

export class UsersWithOrdersResponseDTO extends UserResponseDto {
  orders: Orders[];
}
