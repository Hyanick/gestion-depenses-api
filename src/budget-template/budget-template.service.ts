import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BudgetTemplateLine } from './budget-template-line.entity';

@Injectable()
export class BudgetTemplateService {
    constructor(
        @InjectRepository(BudgetTemplateLine)
        private repo: Repository<BudgetTemplateLine>,
    ) { }

    findAll() {
        return this.repo.find();
    }

    async replaceAll(lines: BudgetTemplateLine[]) {
        await this.repo.clear();
        return this.repo.save(lines);
    }
}
