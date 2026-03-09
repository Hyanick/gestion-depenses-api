import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetTemplateLine } from '../budget-template/budget-template-line.entity';
import { BudgetService } from './budget.service';
import { BudgetController } from './budget.controller';
import { BudgetMonthEntity } from './budget-month.entity';
import { BudgetLineEntity } from './budget-line.entity';
import { BudgetLineHistoryEntity } from './budget-line-history.entity';
import { BudgetHistoryController } from './budget-line-history.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BudgetMonthEntity, BudgetLineEntity, BudgetTemplateLine, BudgetLineHistoryEntity])],
  providers: [BudgetService],
  controllers: [BudgetController, BudgetHistoryController],
})
export class BudgetModule { }
