import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Role, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as process from 'process';

import { AuthService } from '../auth/auth.service';
import { ActivateUserDto } from '../auth/dto/user.register.dto';
import { PrismaService } from '../common/orm/prisma.service';
import { PaginatedDto } from '../common/pagination/response';
import { PublicUserInfoDto } from '../common/query/user.query.dto';
import { UserCreateDto } from './dto/user.create.dto';

@Injectable()
export class UserService {
  private salt = +process.env.SECRET_SALT;
  constructor(
    private prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}
  async getAllUsers(query: PublicUserInfoDto): Promise<PaginatedDto<User>> {
    const limit = 10;
    const page = +query.page || 1;
    const skip = (page - 1) * limit;
    const count = await this.prisma.user.count();
    const entities = await this.prisma.user.findMany({
      take: limit,
      skip: skip,
      orderBy: {
        id: 'asc',
      },
    });
    return {
      page: page,
      pages: Math.ceil(count / limit),
      countItem: count,
      entities,
    };
  }
  async createUserByAdmin(userData: UserCreateDto): Promise<User> {
    const findUser = await this.prisma.user.findUnique({
      where: { email: userData.email.trim() },
    });
    if (findUser) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    let hashedPassword;
    userData.password
      ? (hashedPassword = await this.hashPassword(userData.password))
      : (hashedPassword = null);
    return this.prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
        surname: userData.surname,
        isActive: userData.isActive || false,
        lastLogin: userData.lastLogin || null,
        role: userData.role || Role.manager,
      },
    });
  }

  async activateUserByUser(
    id: string,
    userData: ActivateUserDto,
  ): Promise<User> {
    const passwordHash = await this.hashPassword(userData.password);
    return this.prisma.user.update({
      where: { id: +id },
      data: { password: passwordHash, isActive: true },
    });
  }

  async getUserById(userId: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: +userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  async update(userId: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id: +userId },
      data,
    });
  }

  async remove(userId: string): Promise<User> {
    // const user = await this.findOne(id);
    return this.prisma.user.delete({
      where: { id: +userId },
    });
  }

  async findUserByEmail(userEmail: string): Promise<User> {
    return this.prisma.user.findFirst({
      where: { email: userEmail },
    });
  }

  async hashPassword(password: string) {
    return bcrypt.hash(password, this.salt);
  }

  async signIn(user) {
    return await this.authService.signIn({
      id: user.id.toString(),
    });
  }
}
