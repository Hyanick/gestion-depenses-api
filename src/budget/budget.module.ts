import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetMonth } from './budget-month.entity';
import { BudgetLine } from './budget-line.entity';
import { BudgetTemplateLine } from '../budget-template/budget-template-line.entity';
import { BudgetService } from './budget.service';
import { BudgetController } from './budget.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BudgetMonth, BudgetLine, BudgetTemplateLine])],
  providers: [BudgetService],
  controllers: [BudgetController],
})
export class BudgetModule {}
