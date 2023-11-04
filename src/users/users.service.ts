import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as process from 'process';

import { ActivateUserDto } from '../auth/models_dtos/request';
import { PrismaService } from '../common/orm/prisma.service';
import { PaginatedDto } from '../common/pagination';
import { PublicUserInfoDto } from '../common/query';
import { UserCreateRequestDto, UserUpdateRequestDto } from './models/request';
import { UsersWithOrdersResponseDTO } from './models/response';

@Injectable()
export class UserService {
  private salt = +process.env.SECRET_SALT;
  constructor(private prisma: PrismaService) {}
  async getAllUsers(
    query: PublicUserInfoDto,
  ): Promise<PaginatedDto<UsersWithOrdersResponseDTO>> {
    const { name, surname, email, is_active } = query;
    const limit = 10;
    const count = await this.prisma.user.count({
      where: {
        AND: [
          {
            name: {
              contains: name || undefined,
            },
          },
          {
            surname: {
              contains: surname || undefined,
            },
          },
          {
            email: {
              contains: email || undefined,
            },
          },
          {
            is_active: {
              equals: !!is_active || undefined,
            },
          },
        ].filter(Boolean),
      },
    });
    if (count === 0) {
      throw new NotFoundException('No users found');
    }
    function checkStrDigit(str: string): boolean {
      return /^\d+$/.test(str);
    }
    if (
      query.page &&
      (+query.page > Math.ceil(count / limit) ||
        +query.page < 1 ||
        !checkStrDigit(query.page))
    ) {
      throw new BadRequestException(`Page ${query.page} is not found`);
    }
    const page = +query.page || 1;
    const skip = (page - 1) * limit;
    const entities: UsersWithOrdersResponseDTO[] =
      await this.prisma.user.findMany({
        take: limit,
        skip: skip,
        where: {
          AND: [
            {
              name: {
                contains: name || undefined,
              },
            },
            {
              surname: {
                contains: surname || undefined,
              },
            },
            {
              email: {
                contains: email || undefined,
              },
            },
            {
              is_active: {
                equals: !!is_active || undefined,
              },
            },
          ].filter(Boolean),
        },
        select: {
          id: true,
          email: true,
          name: true,
          surname: true,
          is_active: true,
          created_at: true,
          last_login: true,
          role: true,
          orders: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      });
    return {
      page: page,
      pages: Math.ceil(count / limit),
      countItem: count,
      entities,
    };
  }
  async createUserByAdmin(userData: UserCreateRequestDto): Promise<User> {
    const findUser = await this.prisma.user.findUnique({
      where: { email: userData.email.trim() },
    });
    if (findUser) {
      throw new ConflictException('User with this email already exists');
    }
    // let hashedPassword: string;
    // userData.password
    //   ? (hashedPassword = await this.hashPassword(userData.password))
    //   : (hashedPassword = null);
    return this.prisma.user.create({
      data: {
        email: userData.email.trim(),
        password: null,
        name: userData.name,
        surname: userData.surname,
        is_active: false,
        last_login: null,
        role: Role.manager,
      },
    });
  }

  async activateUserByUser(
    id: string,
    userData: ActivateUserDto,
  ): Promise<void> {
    const passwordHash = await this.hashPassword(userData.password);
    await this.prisma.user.update({
      where: { id: +id },
      data: { password: passwordHash, is_active: true },
    });
  }

  async banUser(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: +userId },
      data: { is_active: false },
    });
  }

  async unbanUser(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: +userId },
      data: { is_active: true },
    });
  }

  async getUserById(userId: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: +userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} is not found`);
    }
    return user;
  }

  async update(userId: string, data: UserUpdateRequestDto): Promise<User> {
    return this.prisma.user.update({
      where: { id: +userId },
      data,
    });
  }

  async remove(userId: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id: +userId },
    });
  }

  async findUserByEmail(userEmail: string): Promise<User> {
    return this.prisma.user.findFirst({
      where: { email: userEmail },
    });
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.salt);
  }
}
