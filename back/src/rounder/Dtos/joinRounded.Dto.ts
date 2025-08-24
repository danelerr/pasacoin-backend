import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class JoinRoundedDto {
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
  idUser: string;

  @ApiProperty({
    description: 'Debe ser el uuid de la ronda',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({
    message: 'El id de la ronda es requerido',
  })
  @IsString({
    message: 'El id de la ronda debe ser una cadena de caracteres',
  })
  idRounded: string;
}
