import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProjectDto {
  @IsString({ message: 'O nome do projeto deve ser um texto.' })
  @IsNotEmpty({ message: 'O nome do projeto é obrigatório.' })
  @MinLength(3, {
    message: 'O nome do projeto deve ter no mínimo 3 caracteres.',
  })
  @MaxLength(100, {
    message: 'O nome do projeto deve ter no máximo 50 caracteres.',
  })
  name!: string;

  @IsNumber({}, { message: 'A porcentagem de comissão deve ser um número.' })
  @Min(0.1, { message: 'A comissão mínima é 0.1%.' })
  @Max(100, { message: 'A comissão máxima é 100%.' })
  commissionPercentage!: number;
}
