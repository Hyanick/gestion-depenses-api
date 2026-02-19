import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetTemplateLine } from './budget-template-line.entity';
import { BudgetTemplateService } from './budget-template.service';
import { BudgetTemplateController } from './budget-template.controller';

@Module({
    imports: [TypeOrmModule.forFeature([BudgetTemplateLine])],
    providers: [BudgetTemplateService],
    controllers: [BudgetTemplateController],
})
export class BudgetTemplateModule { }
