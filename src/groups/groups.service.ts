import { ConflictException, Injectable } from '@nestjs/common';
import { Group } from '@prisma/client';

import { PrismaService } from '../common/orm/prisma.service';
import { GroupCreateDto } from './dto';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<Group[]> {
    return this.prisma.group.findMany();
  }
  async create(group: GroupCreateDto): Promise<Group> {
    const existGroup = await this.prisma.group.findFirst({
      where: {
        title: group.title,
      },
    });
    if (existGroup) {
      throw new ConflictException(`Group ${group.title} already exists`);
    }
    return this.prisma.group.create({
      data: {
        title: group.title,
      },
    });
  }
}
