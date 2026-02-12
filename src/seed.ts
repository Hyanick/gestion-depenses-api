/* 
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransactionsService } from './transactions/transactions.service';

async function bootstrap() {
    // Démarre l'app NestJS
    const app = await NestFactory.createApplicationContext(AppModule);

    // Récupère le service
    const transactionsService = app.get(TransactionsService);

    // Tableau des transactions à insérer (sans id, car auto-généré par la base)
    const transactions = [
        { category: 'Salaire', icon: '💼', description: 'Salaire Annie', date: '2026-10-01', amount: 3775, type: 'income' },
        { category: 'Salaire', icon: '💼', description: 'Salaire Yanick', date: '2026-10-01', amount: 3700, type: 'income' },
        { category: 'CAF', icon: '👶', description: 'CAF enfants', date: '2026-10-01', amount: 150, type: 'income' },
        { category: 'Logement', icon: '🏠', description: 'Appartement (traites+charges+charges compro+taxes foncières)', date: '2026-10-01', amount: 1270, type: 'expense' },
        { category: 'Maison', icon: '🏡', description: 'Maison (traites+charges+imprévus)', date: '2026-10-01', amount: 2440, type: 'expense' },
        { category: 'Éducation', icon: '🎒', description: 'Écoles enfants', date: '2026-10-01', amount: 800, type: 'expense' },
        { category: 'Alimentation', icon: '🍽️', description: 'Ration', date: '2026-10-01', amount: 350, type: 'expense' },
        { category: 'Dettes', icon: '💳', description: 'Dettes Annie + travaux', date: '2026-10-01', amount: 607, type: 'expense' },
        { category: 'Voiture', icon: '🚗', description: 'Voiture (Assurance et autres)', date: '2026-10-01', amount: 350, type: 'expense' },
        { category: 'Transport', icon: '🚌', description: 'Transport Yanick + poche', date: '2026-10-01', amount: 700, type: 'expense' },
        { category: 'Transport', icon: '🚌', description: 'Transport Annie + poche', date: '2026-10-01', amount: 560, type: 'expense' },
        { category: 'Carburant', icon: '⛽', description: 'Carburant voitures', date: '2026-10-01', amount: 150, type: 'expense' },
        { category: 'Épargne', icon: '💰', description: 'Épargne Enfants + CAF', date: '2026-10-01', amount: 500, type: 'expense' },
        { category: 'Njangui', icon: '🤝', description: 'Njangui', date: '2026-10-01', amount: 500, type: 'expense' },
        { category: 'Impôts', icon: '💸', description: 'Impôts / Merveilles', date: '2026-10-01', amount: 230, type: 'expense' },
        { category: 'Vacances', icon: '🏖️', description: 'Budget Vacances', date: '2026-10-01', amount: 150, type: 'expense' },
        { category: 'Imprévus', icon: '❗', description: 'Imprévus', date: '2026-10-01', amount: 200, type: 'expense' },
    ];

    // Insère chaque transaction
    for (const t of transactions) {
        await transactionsService.create({
            ...t,
            type: t.type as 'income' | 'expense'
        });
    }

    console.log('Seed terminé !');
    await app.close();
}

bootstrap();
*/