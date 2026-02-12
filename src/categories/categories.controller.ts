import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @Get()
  findAll(): Promise<Category[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Category | null> {
    return this.service.findOne(Number(id));
  }

  @Post()
  create(@Body() category: Partial<Category>): Promise<Category> {
    return this.service.create(category);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() category: Partial<Category>): Promise<Category | null> {
    return this.service.update(Number(id), category);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ success: boolean }> {
    return { success: await this.service.remove(Number(id)) };
  }
}
