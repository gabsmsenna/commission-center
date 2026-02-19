import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateProjectDto } from './dtos/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createProjectDto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        userId,
        name: createProjectDto.name,
        commissionPercentage: createProjectDto.commissionPercentage,
      },
    });
  }

  async findAll(userId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    return this.prisma.project.findMany({
      where: {
        userId: userId,
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
