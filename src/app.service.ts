import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService implements OnModuleInit {
  getHello(): string {
    return 'Hello World!';
  }
  constructor(private dataSource: DataSource) { }

  async onModuleInit() {
    try {
      await this.dataSource.query('SELECT NOW()');
      console.log('✅ Connexion PostgreSQL réussie !');
    } catch (err) {
      console.error('❌ Erreur de connexion PostgreSQL :', err);
    }
  }
}
