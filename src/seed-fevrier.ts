import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CategoriesService } from './categories/categories.service';
import { TransactionsService } from './transactions/transactions.service';
import { CATEGORIES } from './categories/categories.seed';
import { TRANSACTIONS } from './transactions/transactions.seed';



async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);

    const categoriesService = app.get(CategoriesService);
    const transactionsService = app.get(TransactionsService);

    // 1. Insérer les catégories
    const catMap: Record<string, any> = {};
    for (const cat of CATEGORIES) {
        let dbCat = await categoriesService.findAll().then(cats => cats.find(c => c.name === cat.name));
        if (!dbCat) {
            dbCat = await categoriesService.create({
                ...cat,
                type: cat.type as 'income' | 'expense'
            });
        }
        catMap[cat.name] = dbCat;
    }

    // 2. Insérer les transactions
    for (const t of TRANSACTIONS) {
        const category = catMap[t.categoryName];
        if (!category) continue;
        await transactionsService.create({
            icon: category.icon,
            description: t.description,
            date: t.date,
            amount: t.amount,
            type: t.type as 'income' | 'expense',
            categoryId: category.id,
        });
    }

    console.log('Seed Octobre terminé !');
    await app.close();
}

bootstrap();
