// src/transactions/transactions.seed.ts
export const TRANSACTIONS = [
    // Revenus
    { description: 'Salaire Annie', amount: 3775, type: 'income', categoryName: 'Salaire', date: '2026-02-01' },
    { description: 'Salaire Yanick', amount: 3700, type: 'income', categoryName: 'Salaire', date: '2026-02-01' },
    { description: 'CAF enfants', amount: 150, type: 'income', categoryName: 'CAF', date: '2026-02-01' },

    // Dépenses
    { description: 'Appartement (traites+charges+charges compro+taxes foncières)', amount: 1270, type: 'expense', categoryName: 'Logement', date: '2026-02-01' },
    { description: 'Maison (traites+charges+imprévus)', amount: 2440, type: 'expense', categoryName: 'Maison', date: '2026-02-01' },
    { description: 'Écoles enfants', amount: 800, type: 'expense', categoryName: 'Éducation', date: '2026-02-01' },
    { description: 'Ration', amount: 350, type: 'expense', categoryName: 'Alimentation', date: '2026-02-01' },
    { description: 'Dettes Annie + travaux', amount: 607, type: 'expense', categoryName: 'Dettes', date: '2026-02-01' },
    { description: 'Voiture (Assurance et autres)', amount: 350, type: 'expense', categoryName: 'Voiture', date: '2026-02-01' },
    { description: 'Transport Yanick + poche', amount: 700, type: 'expense', categoryName: 'Transport', date: '2026-02-01' },
    { description: 'Transport Annie + poche', amount: 560, type: 'expense', categoryName: 'Transport', date: '2026-02-01' },
    { description: 'Carburant voitures', amount: 150, type: 'expense', categoryName: 'Carburant', date: '2026-02-01' },
    { description: 'Épargne Enfants + CAF', amount: 500, type: 'expense', categoryName: 'Épargne', date: '2026-02-01' },
    { description: 'Njangui', amount: 500, type: 'expense', categoryName: 'Njangui', date: '2026-02-01' },
    { description: 'Impôts / Merveilles', amount: 230, type: 'expense', categoryName: 'Impôts', date: '2026-02-01' },
    { description: 'Budget Vacances', amount: 150, type: 'expense', categoryName: 'Vacances', date: '2026-02-01' },
    { description: 'Imprévus', amount: 200, type: 'expense', categoryName: 'Imprévus', date: '2026-02-01' },
];
