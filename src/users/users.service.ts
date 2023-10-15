import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as process from 'process';

import { ActivateUserDto } from '../auth/models_dtos/request';
import { PrismaService } from '../common/orm/prisma.service';
import { PaginatedDto } from '../common/pagination/response';
import { PublicUserInfoDto } from '../common/query/user.query.dto';
import { UserCreateRequestDto, UserUpdateRequestDto } from './models/request';
import { UserResponseDto } from './models/response';

@Injectable()
export class UserService {
  private salt = +process.env.SECRET_SALT;
  constructor(private prisma: PrismaService) {}
  async getAllUsers(
    query: PublicUserInfoDto,
  ): Promise<PaginatedDto<UserResponseDto>> {
    const limit = 10;
    const page = +query.page || 1;
    const skip = (page - 1) * limit;
    const count = await this.prisma.user.count();
    const entities: UserResponseDto[] = await this.prisma.user.findMany({
      take: limit,
      skip: skip,
      select: {
        id: true,
        email: true,
        name: true,
        surname: true,
        is_active: true,
        last_login: true,
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
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    let hashedPassword: string;
    userData.password
      ? (hashedPassword = await this.hashPassword(userData.password))
      : (hashedPassword = null);
    return this.prisma.user.create({
      data: {
        email: userData.email.trim(),
        password: hashedPassword,
        name: userData.name,
        surname: userData.surname,
        is_active: userData.is_active || false,
        last_login: userData.last_login || null,
        role: userData.role || Role.manager,
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
    const result = await this.prisma.user.findUnique({
      where: { id: +userId },
    });
    if (!result) {
      throw new NotFoundException(`User with ID ${userId} is not found`);
    }
    return result;
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
