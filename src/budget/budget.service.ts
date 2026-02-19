import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BudgetMonth } from './budget-month.entity';
import { BudgetLine } from './budget-line.entity';
import { BudgetTemplateLine } from '../budget-template/budget-template-line.entity';
import { ReplaceMonthDto } from './dto/replace-month.dto';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(BudgetMonth) private monthRepo: Repository<BudgetMonth>,
    @InjectRepository(BudgetLine) private lineRepo: Repository<BudgetLine>,
    @InjectRepository(BudgetTemplateLine) private templateRepo: Repository<BudgetTemplateLine>,
  ) {}

  async getMonth(monthKey: string) {
    const month = await this.monthRepo.findOne({ where: { monthKey } });
    if (!month) throw new NotFoundException();
    return month;
  }

  async seedFromTemplate(monthKey: string) {
    const templateLines = await this.templateRepo.find();

    const month = this.monthRepo.create({
      monthKey,
      createdFrom: 'template',
      lines: templateLines.map((t) =>
        this.lineRepo.create({
          type: t.type,
          category: t.category,
          label: t.label,
          amount: Number(t.amount),
          icon: t.icon,
          color: t.color,
        }),
      ),
    });

    return this.monthRepo.save(month);
  }

  async duplicate(fromKey: string, toKey: string) {
    const from = await this.getMonth(fromKey);

    const month = this.monthRepo.create({
      monthKey: toKey,
      createdFrom: 'duplicate',
      lines: from.lines.map((l) =>
        this.lineRepo.create({
          type: l.type,
          category: l.category,
          label: l.label,
          amount: Number(l.amount),
          icon: l.icon,
          color: l.color,
        }),
      ),
    });

    return this.monthRepo.save(month);
  }

  async resetFromTemplate(monthKey: string) {
    const month = await this.getMonth(monthKey);
    await this.lineRepo.delete({ month });

    const templateLines = await this.templateRepo.find();
    month.lines = templateLines.map((t) =>
      this.lineRepo.create({
        type: t.type,
        category: t.category,
        label: t.label,
        amount: Number(t.amount),
        icon: t.icon,
        color: t.color,
      }),
    );
    month.createdFrom = 'template';

    return this.monthRepo.save(month);
  }

  /**
   * ✅ BATCH FLUSH
   * Remplace le contenu du mois par les lignes envoyées
   * - crée le mois s'il n'existe pas
   * - supprime les anciennes lignes
   * - insère les nouvelles
   */
  async replaceMonth(monthKey: string, dto: ReplaceMonthDto) {
    let month = await this.monthRepo.findOne({ where: { monthKey } });

    if (!month) {
      month = await this.monthRepo.save(
        this.monthRepo.create({
          monthKey,
          createdFrom: dto.createdFrom ?? 'manual',
          lines: [],
        }),
      );
    }

    await this.lineRepo.delete({ month });

    const lines = dto.lines.map((l) =>
      this.lineRepo.create({
        type: l.type,
        category: l.category,
        label: l.label,
        amount: Number(l.amount) || 0,
        icon: l.icon,
        color: l.color,
        month,
      }),
    );

    await this.lineRepo.save(lines);

    // re-fetch month with eager lines
    return this.getMonth(monthKey);
  }
}
