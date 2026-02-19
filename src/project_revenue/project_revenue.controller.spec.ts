import { Test, TestingModule } from '@nestjs/testing';
import { ProjectRevenueController } from './project_revenue.controller';
import { ProjectRevenueService } from './project_revenue.service';

describe('ProjectRevenueController', () => {
  let controller: ProjectRevenueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectRevenueController],
      providers: [ProjectRevenueService],
    }).compile();

    controller = module.get<ProjectRevenueController>(ProjectRevenueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
