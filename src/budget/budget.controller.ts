import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { CurrentUserType } from 'src/auth/current-user.decorator';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { BudgetService } from './budget.service';

@ApiTags('budgets')
@UseGuards(JwtAuthGuard)
@Controller('api/budgets')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) { }

  @Get(':monthKey')
  getMonth(@Param('monthKey') monthKey: string, @CurrentUser() u: CurrentUserType,) {
    return this.budgetService.getMonth(u.id, monthKey);
  }
  /*
  getMonth(@Param('monthKey') monthKey: string) {
    return this.service.getMonth(monthKey);
  }
*/
  /*
    @Post(':monthKey/seed-from-template')
    seed(@Param('monthKey') monthKey: string) {
      return this.budgetService.seedFromTemplate(monthKey);
    }
  */
  @Post(':toKey/duplicate-from/:fromKey')
  duplicate(@Param('fromKey') fromKey: string, @Param('toKey') toKey: string, @CurrentUser() u: CurrentUserType,) {
    return this.budgetService.duplicate(u.id, fromKey, toKey);
  }

  @Post(':monthKey/reset-from-template')
  reset(@Param('monthKey') monthKey: string, @CurrentUser() u: CurrentUserType,) {
    return this.budgetService.resetFromTemplate(u.id, monthKey);
  }

  // ✅ batch flush
  @Put(':monthKey')
  replaceMonth(@Param('monthKey') monthKey: string, @Body() dto: any, @CurrentUser() u: CurrentUserType,) {
    return this.budgetService.replaceMonth(u.id, monthKey, dto);
  }
  /*
  replaceMonth(@Param('monthKey') monthKey: string, @Body() dto: ReplaceMonthDto) {
    return this.budgetService.replaceMonth(monthKey, dto);
  }*/
}
