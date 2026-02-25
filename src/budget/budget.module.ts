import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetTemplateLine } from '../budget-template/budget-template-line.entity';
import { BudgetService } from './budget.service';
import { BudgetController } from './budget.controller';
import { BudgetMonthEntity } from './budget-month.entity';
import { BudgetLineEntity } from './budget-line.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BudgetMonthEntity, BudgetLineEntity, BudgetTemplateLine])],
  providers: [BudgetService],
  controllers: [BudgetController],
})
export class BudgetModule { }
