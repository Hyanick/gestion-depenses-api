import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


import { CurrentUser } from '../auth/current-user.decorator';
import type { CurrentUserType } from '../auth/current-user.decorator';
import { BudgetLineHistoryEntity } from './budget-line-history.entity';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/budget-history')
export class BudgetHistoryController {
  constructor(
    @InjectRepository(BudgetLineHistoryEntity)
    private readonly historyRepo: Repository<BudgetLineHistoryEntity>,
  ) {}

  @Get(':monthKey')
  async getMonthHistory(
    @CurrentUser() user: CurrentUserType,
    @Param('monthKey') monthKey: string,
  ) {
    return this.historyRepo.find({
      where: { userId: user.id, monthKey },
      order: { createdAt: 'DESC' },
      take: 200,
    });
  }
}