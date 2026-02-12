import { ApiProperty } from '@nestjs/swagger'; // Décrit les champs dans Swagger

export class CreateTransactionDto {
    @ApiProperty({ example: 'Salaire', description: 'Catégorie de la transaction' })
    category: string;

    @ApiProperty({ example: '💼', description: 'Icône associée à la catégorie' })
    icon: string;

    @ApiProperty({ example: 'Salaire octobre', description: 'Libellé/description' })
    description: string;

    @ApiProperty({ example: '2026-10-01', description: 'Date (format YYYY-MM-DD)' })
    date: string;

    @ApiProperty({ example: 3200, description: 'Montant de la transaction' })
    amount: number;

    @ApiProperty({ example: 'income', enum: ['income', 'expense'], description: 'Type: revenu ou dépense' })
    type: 'income' | 'expense';
}
