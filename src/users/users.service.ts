import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../common/orm/prisma.service';
import { PaginatedDto } from '../common/pagination/response';
import { PublicUserInfoDto } from '../common/query/user.query.dto';

@Injectable()
export class UserService {
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
  async create(data: Prisma.UserCreateInput): Promise<any> {
    const findUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (findUser) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    data.password = await this.authService.getHash(data.password);
    const newUser = this.prisma.user.create({ data });

    const token = await this.authService.singIn(newUser);

    return { token };
  }

  async findOne(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<User> {
    // const user = await this.findOne(id);
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async singIn(user) {
    return await this.authService.signIn({
      id: user.id.toString(),
    });
  }
}
