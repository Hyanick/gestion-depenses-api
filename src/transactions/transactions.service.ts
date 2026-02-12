import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';

type FindFilteredArgs = {
  month?: string; // ex: '2026-10'
  categoryId?: number; // ex: 3
};

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
  ) { }

  // Récupérer toutes les transactions
  findAll(): Promise<Transaction[]> {
    return this.transactionsRepository.find();
  }

  // Filtre par mois (YYYY-MM) et/ou categoryId
  async findFiltered(args: FindFilteredArgs): Promise<Transaction[]> {
    const qb = this.transactionsRepository.createQueryBuilder('t');
    // Pas de join ici, car tu veux juste categoryId (pas l'objet)
    if (args.month) {
      qb.andWhere('t.date LIKE :month', { month: `${args.month}-%` });
    }
    if (args.categoryId != null) {
      qb.andWhere('t.categoryId = :categoryId', { categoryId: args.categoryId });
    }
    qb.orderBy('t.date', 'DESC');
    return qb.getMany();
  }

  // Récupérer une transaction par id
  findOne(id: number): Promise<Transaction | null> {
    return this.transactionsRepository.findOneBy({ id });
  }

  // Créer une transaction
  create(transaction: Partial<Transaction>): Promise<Transaction> {
    const newTransaction = this.transactionsRepository.create(transaction);
    return this.transactionsRepository.save(newTransaction);
  }

  // Mettre à jour une transaction
  async update(id: number, transaction: Partial<Transaction>): Promise<Transaction | null> {
    await this.transactionsRepository.update(id, transaction);
    return this.findOne(id);
  }

  // Supprimer une transaction
  async remove(id: number): Promise<boolean> {
    const result = await this.transactionsRepository.delete(id);
    return result.affected !== 0;
  }
}
