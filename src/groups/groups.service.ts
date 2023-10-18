import { Injectable } from '@nestjs/common';
import { Group } from '@prisma/client';

import { PrismaService } from '../common/orm/prisma.service';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<Group[]> {
    return this.prisma.group.findMany();
  }
  // async create(title: string): Promise<Group> {
  //   return this.prisma.group.create({
  //     data: {
  //       title,
  //     },
  //   });
  // }
}
