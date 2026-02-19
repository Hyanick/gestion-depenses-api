import { DataSource } from 'typeorm';
import { BudgetMonth } from '../budget/budget-month.entity';
import { BudgetLine } from '../budget/budget-line.entity';
import { BudgetTemplateLine } from '../budget-template/budget-template-line.entity';

const ds = new DataSource({
    type: 'postgres',
    url: 'postgresql://neondb_owner:npg_dOm91qBnVhrk@ep-lively-term-ajbfhkmw-pooler.c-3.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    entities: [BudgetMonth, BudgetLine, BudgetTemplateLine],
    synchronize: true,
});

async function run() {
    await ds.initialize();

    const monthRepo = ds.getRepository(BudgetMonth);
    const lineRepo = ds.getRepository(BudgetLine);
    const templateRepo = ds.getRepository(BudgetTemplateLine);

    console.log('🧹 Cleaning tables...');

    // ✅ DELETE en ordre FK-safe (évite TRUNCATE + FK constraint)
    await ds.createQueryBuilder().delete().from(BudgetLine).execute();
    await ds.createQueryBuilder().delete().from(BudgetMonth).execute();
    await ds.createQueryBuilder().delete().from(BudgetTemplateLine).execute();

    console.log('📦 Inserting template...');

    const templateLines = await templateRepo.save([
        { type: 'income', category: 'Salaire', label: 'Salaire Annie', amount: 3775, icon: 'work', color: '#3aa0d8' },
        { type: 'income', category: 'Salaire', label: 'Salaire Yanick', amount: 3700, icon: 'work', color: '#3aa0d8' },
        { type: 'income', category: 'CAF', label: 'CAF enfants', amount: 150, icon: 'emoji_events', color: '#22c55e' },

        { type: 'expense', category: 'Logement', label: 'Appartement (charges+taxes...)', amount: 1270, icon: 'home', color: '#f59e0b' },
        { type: 'expense', category: 'Maison', label: 'Maison (charges+imprévus)', amount: 2440, icon: 'cottage', color: '#8b5cf6' },
        { type: 'expense', category: 'Éducation', label: 'Écoles enfants', amount: 800, icon: 'school', color: '#eab308' },
        { type: 'expense', category: 'Alimentation', label: 'Ration', amount: 350, icon: 'restaurant', color: '#22c55e' },
    ]);

    console.log('📅 Creating test month 2026-02...');

    const month = await monthRepo.save(
        monthRepo.create({
            monthKey: '2026-02',
            createdFrom: 'template',
            lines: [],
        })
    );

    console.log('🧾 Copy template -> month lines...');

    await lineRepo.save(
        templateLines.map((t) =>
            lineRepo.create({
                type: t.type,
                category: t.category,
                label: t.label,
                amount: Number(t.amount),
                icon: t.icon,
                color: t.color,
                month,
            })
        )
    );

    console.log('✅ Seed terminé.');
    await ds.destroy();
}

run().catch(async (err) => {
    console.error(err);
    try { await ds.destroy(); } catch { }
    process.exit(1);
});