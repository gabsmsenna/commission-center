import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { parseISO, startOfDay, endOfDay } from 'date-fns';
import { Prisma } from '@prisma/client';

@Injectable()
export class CommissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async calculateUserCommission(
    userId: number,
    startDate?: string,
    endDate?: string,
  ) {
    const revenueDateFilter: Prisma.ProjectRevenueWhereInput['revenueDate'] =
      {};

    if (startDate) {
      const parsedStartDate = parseISO(startDate);
      revenueDateFilter.gte = startOfDay(parsedStartDate);
    }

    if (endDate) {
      const parsedEndDate = parseISO(endDate);
      revenueDateFilter.lte = endOfDay(parsedEndDate);
    }

    const hasDateFilter = startDate || endDate;

    const projects = await this.prisma.project.findMany({
      where: {
        userId,
        active: true,
      },
      include: {
        revenues: {
          where: {
            active: true,
            ...(hasDateFilter && {
              revenueDate: revenueDateFilter,
            }),
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    let totalCommission = 0;

    const projectsWithCommission = projects.map((project) => {
      let totalProjectCommission = 0;
      const commissionRate = Number(project.commissionPercentage) / 100;

      const revenues = project.revenues.map((revenue) => {
        const profitAmount = Number(revenue.profitAmount);
        const commission = profitAmount * commissionRate;

        totalProjectCommission += commission;

        return {
          revenueId: revenue.id,
          description: revenue.description,
          profitAmount: profitAmount,
          commission: Math.round(commission * 100) / 100,
        };
      });

      totalCommission += totalProjectCommission;

      return {
        projectId: project.id,
        projectName: project.name,
        commissionPercentage: Number(project.commissionPercentage),
        revenues,
        totalProjectCommission: Math.round(totalProjectCommission * 100) / 100,
      };
    });

    return {
      projects: projectsWithCommission,
      totalCommission: Math.round(totalCommission * 100) / 100,
    };
  }
}
