import { Controller, Get, Put, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BudgetTemplateService } from './budget-template.service';
import { BudgetTemplateLine } from './budget-template-line.entity';

@ApiTags('budget-template')
@Controller('api/budget-template')
export class BudgetTemplateController {
    constructor(private readonly service: BudgetTemplateService) { }

    @Get()
    getAll() {
        return {
            lines: this.service.findAll(),
            updatedAt: new Date().toISOString(),
        };
    }

    @Put()
    replace(@Body() payload: { lines: BudgetTemplateLine[] }) {
        return this.service.replaceAll(payload.lines);
    }
}
