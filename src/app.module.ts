import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionsModule } from './transactions/transactions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [

    TypeOrmModule.forRoot({
      /*  type: 'postgres',
        host: 'localhost', // ou l'adresse de votre serveur DB
        port: 5432, // Port PostgreSQL
        username: 'postgres',
        password: 'root', // password: 'postgres', root
        database: 'gestion_depenses_db',*/
      // entities: [Transaction],
      type: 'postgres',
      url: 'postgresql://neondb_owner:npg_dOm91qBnVhrk@ep-lively-term-ajbfhkmw-pooler.c-3.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
      autoLoadEntities: true,
     // synchronize: false, // désactive en production
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // À désactiver en production
    }),
    TransactionsModule,
    CategoriesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
