import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { CommissionsService } from './commissions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('commissions')
export class CommissionsController {
  constructor(private readonly commissionsService: CommissionsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  calculate(
    @Request() req: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const userId = req.user.userId;
    return this.commissionsService.calculateUserCommission(
      userId,
      startDate,
      endDate,
    );
  }
}
