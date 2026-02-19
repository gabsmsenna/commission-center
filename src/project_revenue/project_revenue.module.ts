import { Module } from '@nestjs/common';
import { ProjectRevenueService } from './project_revenue.service';
import { ProjectRevenueController } from './project_revenue.controller';

@Module({
  controllers: [ProjectRevenueController],
  providers: [ProjectRevenueService],
})
export class ProjectRevenueModule {}
