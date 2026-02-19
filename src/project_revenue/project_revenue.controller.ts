import { Controller } from '@nestjs/common';
import { ProjectRevenueService } from './project_revenue.service';

@Controller('project-revenue')
export class ProjectRevenueController {
  constructor(private readonly projectRevenueService: ProjectRevenueService) {}
}
