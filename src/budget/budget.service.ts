import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BudgetMonthEntity } from './budget-month.entity';
import { BudgetLineEntity } from './budget-line.entity';



@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(BudgetMonthEntity)
    private readonly monthRepo: Repository<BudgetMonthEntity>,

    @InjectRepository(BudgetLineEntity)
    private readonly lineRepo: Repository<BudgetLineEntity>,
  ) { }

  /*
  ============================================================
  LOAD MONTH
  ============================================================
  */

  async getMonth(userId: string, monthKey: string) {
    let month = await this.monthRepo.findOne({
      where: { monthKey, userId },
      relations: ['lines'],
      order: { lines: { createdAt: 'ASC' } },
    });

    // Si mois inexistant → création automatique
    if (!month) {
      month = await this.monthRepo.save(
        this.monthRepo.create({
          monthKey,
          userId,
          lines: [],
        }),
      );
    }

    return month;
  }

  /*
  ============================================================
  REPLACE MONTH (flush batch depuis frontend)
  ============================================================
  */

  async replaceMonth(userId: string, monthKey: string, dto: any) {
    let month = await this.monthRepo.findOne({
      where: { monthKey, userId },
      relations: ['lines'],
    });

    // Création mois si inexistant

    if (!month) {
      try {
        month = await this.monthRepo.save(this.monthRepo.create({ monthKey, userId }));
      } catch (e: any) {
        if (e?.code === '23505') {
          month = await this.monthRepo.findOne({ where: { monthKey, userId }, relations: ['lines'] });
        } else {
          throw e;
        }
      }
      /*
      month = await this.monthRepo.save(
        this.monthRepo.create({
          monthKey,
          userId,
        }),
      )
        */
    }

    /*
    --------------------------------------------
    Supprimer anciennes lignes
    --------------------------------------------
    */

    if (month.lines?.length) {
      await this.lineRepo.delete({
        month: { id: month.id },
      });
    }

    /*
    --------------------------------------------
    Créer nouvelles lignes
    --------------------------------------------
    */

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

    await this.lineRepo.save(lines);

    return this.getMonth(userId, monthKey);
  }

  /*
  ============================================================
  RESET MONTH (depuis template plus tard)
  ============================================================
  */

  async resetFromTemplate(userId: string, monthKey: string) {
    const month = await this.monthRepo.findOne({
      where: { monthKey, userId },
      relations: ['lines'],
    });

    if (!month) return;

    await this.lineRepo.delete({ month: { id: month.id } });

    return this.getMonth(userId, monthKey);
  }

  /*
  ============================================================
  DUPLICATE MONTH
  ============================================================
  */

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
      target = await this.monthRepo.save(
        this.monthRepo.create({
          monthKey: toMonthKey,
          userId,
        }),
      );
    }

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

    await this.lineRepo.save(copied);

    return this.getMonth(userId, toMonthKey);
  }
}