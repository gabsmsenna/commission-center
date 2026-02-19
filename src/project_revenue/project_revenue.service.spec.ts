import { Test, TestingModule } from '@nestjs/testing';
import { ProjectRevenueService } from './project_revenue.service';

describe('ProjectRevenueService', () => {
  let service: ProjectRevenueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectRevenueService],
    }).compile();

    service = module.get<ProjectRevenueService>(ProjectRevenueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
