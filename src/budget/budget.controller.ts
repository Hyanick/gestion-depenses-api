import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BudgetService } from './budget.service';
import { ReplaceMonthDto } from './dto/replace-month.dto';

@ApiTags('budgets')
@Controller('api/budgets')
export class BudgetController {
  constructor(private readonly service: BudgetService) {}

  @Get(':monthKey')
  getMonth(@Param('monthKey') monthKey: string) {
    return this.service.getMonth(monthKey);
  }

  @Post(':monthKey/seed-from-template')
  seed(@Param('monthKey') monthKey: string) {
    return this.service.seedFromTemplate(monthKey);
  }

  @Post(':toKey/duplicate-from/:fromKey')
  duplicate(@Param('fromKey') fromKey: string, @Param('toKey') toKey: string) {
    return this.service.duplicate(fromKey, toKey);
  }

  @Post(':monthKey/reset-from-template')
  reset(@Param('monthKey') monthKey: string) {
    return this.service.resetFromTemplate(monthKey);
  }

  // ✅ batch flush
  @Put(':monthKey')
  replaceMonth(@Param('monthKey') monthKey: string, @Body() dto: ReplaceMonthDto) {
    return this.service.replaceMonth(monthKey, dto);
  }
}
