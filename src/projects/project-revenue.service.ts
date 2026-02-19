import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateProjectRevenueDto } from './dtos/create-project-revenue.dto';

@Injectable()
export class ProjectRevenueService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: number,
    projectId: number,
    data: CreateProjectRevenueDto,
  ) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      throw new NotFoundException('Projeto não encontrado.');
    }

    return this.prisma.projectRevenue.create({
      data: {
        projectId,
        description: data.description,
        profitAmount: data.profitAmount,
        revenueDate: new Date(data.revenueDate),
      },
    });
  }
}
