import { IsArray, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class ReplaceMonthDtoLine {
  @IsOptional()
  @IsString()
  id?: string;

  @IsIn(['income', 'expense'])
  type: 'income' | 'expense';

  @IsString()
  category: string;

  @IsString()
  label: string;

  @IsNumber()
  amount: number;

  @IsString()
  icon: string;

  @IsString()
  color: string;
}

export class ReplaceMonthDto {
  @IsArray()
  lines: ReplaceMonthDtoLine[];

  @IsOptional()
  @IsIn(['template', 'duplicate', 'manual'])
  createdFrom?: 'template' | 'duplicate' | 'manual';
}
