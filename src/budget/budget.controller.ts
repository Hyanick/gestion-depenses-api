import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BudgetService } from './budget.service';
import { ReplaceMonthDto } from './dto/replace-month.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@ApiTags('budgets')
@UseGuards(JwtAuthGuard)
@Controller('api/budgets')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) { }

  @Get(':monthKey')
  getMonth(@Param('monthKey') monthKey: string, @Req() req: any) {
    return this.budgetService.getMonth(req.user.userId, monthKey);
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
  duplicate(@Param('fromKey') fromKey: string, @Param('toKey') toKey: string, @Req() req: any) {
    return this.budgetService.duplicate(req.user.userId, fromKey, toKey);
  }

  @Post(':monthKey/reset-from-template')
  reset(@Param('monthKey') monthKey: string, @Req() req: any) {
    return this.budgetService.resetFromTemplate(req.user.userId, monthKey);
  }

  // ✅ batch flush
  @Put(':monthKey')
  replaceMonth(@Param('monthKey') monthKey: string, @Body() dto: any, @Req() req: any) {
    return this.budgetService.replaceMonth(req.user.userId, monthKey, dto);
  }
  /*
  replaceMonth(@Param('monthKey') monthKey: string, @Body() dto: ReplaceMonthDto) {
    return this.budgetService.replaceMonth(monthKey, dto);
  }*/
}
