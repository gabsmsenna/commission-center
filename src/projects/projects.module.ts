import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { PrismaService } from 'prisma/prisma.service';
import { ProjectRevenueService } from './project-revenue.service';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectRevenueService, PrismaService],
})
export class ProjectsModule {}
