import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionsModule } from './transactions/transactions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from './categories/categories.module';
import { BudgetModule } from './budget/budget.module';
import { BudgetTemplateModule } from './budget-template/budget-template.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      /*  type: 'postgres',
        host: 'localhost', // ou l'adresse de votre serveur DB
        port: 5432, // Port PostgreSQL
        username: 'postgres',
        password: 'root', // password: 'postgres', root
        database: 'gestion_depenses_db',*/
      // entities: [Transaction],
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      // synchronize: false, // désactive en production
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // À désactiver en production
    }),
    TransactionsModule,
    CategoriesModule,
    BudgetModule,
    BudgetTemplateModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
