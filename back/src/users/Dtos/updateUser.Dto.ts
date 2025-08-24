import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
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
    description: 'Debe ser el nombre del usuario',
    example: 'John Doe',
  })
  @IsNotEmpty({
    message: 'El nombre del usuario es requerido',
  })
  @IsString({
    message: 'El nombre del usuario debe ser una cadena de caracteres',
  })
  name: string;
}
