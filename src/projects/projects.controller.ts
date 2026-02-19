// src/projects/projects.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateProjectDto } from './dtos/create-project.dto';
import { CreateProjectRevenueDto } from './dtos/create-project-revenue.dto';
import { ProjectRevenueService } from './project-revenue.service';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly projectRevenueService: ProjectRevenueService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req: any, @Body() createProjectDto: CreateProjectDto) {
    const userId = req.user.userId;
    return this.projectsService.create(userId, createProjectDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Request() req: any,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const userId = req.user.userId;
    return this.projectsService.findAll(userId, +page, +limit);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/revenues')
  createRevenue(
    @Request() req: any,
    @Param('id') projectId: string,
    @Body() createProjectRevenueDto: CreateProjectRevenueDto,
  ) {
    const userId = req.user.userId;
    return this.projectRevenueService.create(
      userId,
      +projectId,
      createProjectRevenueDto,
    );
  }
}
