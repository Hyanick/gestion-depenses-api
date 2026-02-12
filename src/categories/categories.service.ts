import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  findAll(): Promise<Category[]> {
    return this.categoriesRepository.find();
  }

  findOne(id: number): Promise<Category | null> {
    return this.categoriesRepository.findOneBy({ id });
  }

  create(category: Partial<Category>): Promise<Category> {
    const newCategory = this.categoriesRepository.create(category);
    return this.categoriesRepository.save(newCategory);
  }

  async update(id: number, category: Partial<Category>): Promise<Category | null> {
    await this.categoriesRepository.update(id, category);
    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.categoriesRepository.delete(id);
    return result.affected !== 0;
  }
}
