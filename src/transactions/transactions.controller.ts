import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transaction } from './transaction.entity';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('transactions') // Tag Swagger
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly service: TransactionsService) { }
  /*
    @Get()
    findAll(): Promise<Transaction[]> {
      return this.service.findAll();
    }
  */
  @Get()
  @ApiQuery({ name: 'month', required: true, example: '2026-01' })
  @ApiQuery({ name: 'categoryId', required: false, example: '1' })
  findAll(
    @Query('month') month?: string,
    @Query('categoryId') categoryId?: string
  ): Promise<Transaction[]> {
    return this.service.findFiltered({
      month,
      categoryId: categoryId ? Number(categoryId) : undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Transaction | null> {
    return this.service.findOne(Number(id));
  }

  @Post()
  create(@Body() transaction: Partial<Transaction>): Promise<Transaction> {
    return this.service.create(transaction);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() transaction: Partial<Transaction>): Promise<Transaction | null> {

    return this.service.update(Number(id), transaction);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ success: boolean }> {
    return { success: await this.service.remove(Number(id)) };
  }
}
