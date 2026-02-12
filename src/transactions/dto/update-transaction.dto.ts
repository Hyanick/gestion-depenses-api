import { PartialType } from '@nestjs/swagger';
import { CreateTransactionDto } from './create-transaction.dto';

// Hérite de CreateTransactionDto mais rend tous les champs optionnels
export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}
