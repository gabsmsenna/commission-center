/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedUsersResponse {
  data: UserResponse[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedUsersResponse> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where: { deletedAt: null },
        skip,
        take: limit,
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.user.count({ where: { deletedAt: null } }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findByEmail(email: string): Promise<UserResponse | null> {
    const user = await this.prisma.user.findFirst({
      where: { email, deletedAt: null },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        password: true,
      },
    });

    return user;
  }

  async findOne(id: number): Promise<UserResponse> {
    const user = (await this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    })) as UserResponse | null;

    if (!user) {
      throw new NotFoundException(
        `Usuário com ID ${id} não encontrado ou já foi removido.`,
      );
    }

    return user;
  }
  async softDelete(id: number): Promise<{ message: string }> {
    await this.findOne(id);

    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: 'Usuário removido com sucesso.' };
  }
}
