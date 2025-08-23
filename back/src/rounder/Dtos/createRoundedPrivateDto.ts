import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateRoundedPrivateDto {
  @ApiProperty({
    description: 'Debe ser el uuid del usuario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({
    message: 'El id del usuario es requerido',
  })
  @IsString({
    message: 'El id del usuario debe ser una cadena de caracteres',
  })
  id: string;

  @ApiProperty({
    description: 'Número de rondas seleccionadas',
    example: 10,
  })
  @IsNotEmpty({
    message: 'El número de rondas es requerido',
  })
  @IsInt({
    message: 'El número de rondas debe ser un entero',
  })
  numberOfRounds: number;

  @ApiProperty({
    description: 'Valor de la ronda a pagar en USDM',
    example: 5,
  })
  @IsNotEmpty({
    message: 'El valor a pagar por ronda es requerido',
  })
  @IsInt({
    message: 'El valor a pagar por ronda debe ser un entero',
  })
  payOfRounds: number;

  @ApiProperty({
    description: 'Número de participantes en la ronda',
    example: 3,
  })
  @IsInt({
    message: 'El número de participantes debe ser un entero',
  })
  numberOfParticipants?: number;

  @ApiProperty({
    description: 'Duración de las rondas en dias',
    example: 30,
  })
  @IsNotEmpty({
    message: 'La duración de las rondas es requerida',
  })
  @IsInt({
    message: 'La duración de las rondas debe ser un entero',
  })
  durationOfRounds: number;
}
