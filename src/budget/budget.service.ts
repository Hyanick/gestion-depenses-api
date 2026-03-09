import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BudgetMonthEntity } from './budget-month.entity';
import { BudgetLineEntity } from './budget-line.entity';
import { BudgetLineHistoryEntity } from './budget-line-history.entity';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(BudgetMonthEntity)
    private readonly monthRepo: Repository<BudgetMonthEntity>,

    @InjectRepository(BudgetLineEntity)
    private readonly lineRepo: Repository<BudgetLineEntity>,

    @InjectRepository(BudgetLineHistoryEntity)
    private readonly historyRepo: Repository<BudgetLineHistoryEntity>,
  ) {}

  private sanitizeLine(l: any) {
    if (!l) return null;
    const { month, ...rest } = l;
    return rest;
  }

  private async logHistory(
    userId: string,
    monthKey: string,
    action: 'create' | 'update' | 'delete' | 'replace_month',
    opts: { lineId?: string | null; before?: any; after?: any } = {},
  ) {
    await this.historyRepo.save(
      this.historyRepo.create({
        userId,
        monthKey,
        action,
        lineId: opts.lineId ?? null,
        before: opts.before ?? null,
        after: opts.after ?? null,
      }),
    );
  }

  async getMonth(userId: string, monthKey: string) {
    let month = await this.monthRepo.findOne({
      where: { monthKey, userId },
      relations: ['lines'],
    });

    if (!month) {
      try {
        month = await this.monthRepo.save(
          this.monthRepo.create({
            monthKey,
            userId,
            lines: [],
          }),
        );
      } catch (e: any) {
        // sécurité si concurrence
        if (e?.code === '23505') {
          month = await this.monthRepo.findOne({
            where: { monthKey, userId },
            relations: ['lines'],
          });
        } else {
          throw e;
        }
      }
    }

    return month;
  }

  async replaceMonth(userId: string, monthKey: string, dto: any) {
    let month = await this.monthRepo.findOne({
      where: { monthKey, userId },
      relations: ['lines'],
    });

    if (!month) {
      try {
        month = await this.monthRepo.save(
          this.monthRepo.create({
            monthKey,
            userId,
          }),
        );
      } catch (e: any) {
        if (e?.code === '23505') {
          month = await this.monthRepo.findOne({
            where: { monthKey, userId },
            relations: ['lines'],
          });
        } else {
          throw e;
        }
      }
    }

    const beforeLines = (month?.lines ?? []).map((l) => this.sanitizeLine(l));

    if (month.lines?.length) {
      await this.lineRepo.delete({
        month: { id: month.id },
      });
    }

    const lines = (dto.lines ?? []).map((l: any) =>
      this.lineRepo.create({
        type: l.type ?? 'expense',
        category: l.category ?? '',
        label: l.label ?? '',
        amount: Number(l.amount) || 0,
        icon: l.icon ?? 'payments',
        color: l.color ?? '#64748b',
        month,
      }),
    );

    const savedLines = await this.lineRepo.save(lines);
    const afterLines = savedLines.map((l) => this.sanitizeLine(l));

    await this.logHistory(userId, monthKey, 'replace_month', {
      before: beforeLines,
      after: afterLines,
    });

    return this.getMonth(userId, monthKey);
  }

  async resetFromTemplate(userId: string, monthKey: string) {
    const month = await this.monthRepo.findOne({
      where: { monthKey, userId },
      relations: ['lines'],
    });

    if (!month) return;

    const beforeLines = (month.lines ?? []).map((l) => this.sanitizeLine(l));

    await this.lineRepo.delete({ month: { id: month.id } });

    await this.logHistory(userId, monthKey, 'replace_month', {
      before: beforeLines,
      after: [],
    });

    return this.getMonth(userId, monthKey);
  }

  async duplicate(userId: string, fromMonthKey: string, toMonthKey: string) {
    const from = await this.monthRepo.findOne({
      where: { monthKey: fromMonthKey, userId },
      relations: ['lines'],
    });

    if (!from) return this.getMonth(userId, toMonthKey);

    let target = await this.monthRepo.findOne({
      where: { monthKey: toMonthKey, userId },
      relations: ['lines'],
    });

    if (!target) {
      try {
        target = await this.monthRepo.save(
          this.monthRepo.create({
            monthKey: toMonthKey,
            userId,
          }),
        );
      } catch (e: any) {
        if (e?.code === '23505') {
          target = await this.monthRepo.findOne({
            where: { monthKey: toMonthKey, userId },
            relations: ['lines'],
          });
        } else {
          throw e;
        }
      }
    }

    const beforeLines = (target.lines ?? []).map((l) => this.sanitizeLine(l));

    await this.lineRepo.delete({ month: { id: target.id } });

    const copied = from.lines.map((l) =>
      this.lineRepo.create({
        type: l.type,
        category: l.category,
        label: l.label,
        amount: l.amount,
        icon: l.icon,
        color: l.color,
        month: target,
      }),
    );

    const saved = await this.lineRepo.save(copied);

    await this.logHistory(userId, toMonthKey, 'replace_month', {
      before: beforeLines,
      after: saved.map((l) => this.sanitizeLine(l)),
    });

    return this.getMonth(userId, toMonthKey);
  }
}