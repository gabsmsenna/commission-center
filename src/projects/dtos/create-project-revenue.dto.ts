import { Type } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class CreateProjectRevenueDto {
  @IsString({ message: 'A descrição deve ser um texto.' })
  @IsNotEmpty({ message: 'A descrição é obrigatória.' })
  description!: string;

  @IsNumber({}, { message: 'O valor do lucro deve ser um número.' })
  @Min(0, { message: 'O valor do lucro deve ser positivo.' })
  profitAmount!: number;

  // 1. O class-transformer converte a string ISO ("2026-02-19") para um objeto Date
  @Type(() => Date)
  // 2. O class-validator verifica se a conversão resultou em uma Data válida
  @IsDate({ message: 'A data da receita deve ser uma data válida.' })
  @IsNotEmpty({ message: 'A data da receita é obrigatória.' })
  revenueDate!: Date; // 3. O tipo muda de string para Date
}
