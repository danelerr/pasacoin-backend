import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginWalletUserDto {
  @ApiProperty({
    description: 'la dirección de la billetera del usuario',
  })
  @IsString({
    message: 'La dirección de la billetera debe ser una cadena de texto',
  })
  @IsNotEmpty({
    message: 'La dirección de la billetera no debe estar vacía',
  })
  address: string;

  @ApiProperty({
    description: 'la firma del usuario',
  })
  @IsString({
    message: 'La firma debe ser una cadena de texto',
  })
  @IsNotEmpty({
    message: 'La firma no debe estar vacía',
  })
  signature: string;

  @ApiProperty({
    description: 'el desafío a resolver',
  })
  @IsNotEmpty({
    message: 'El desafío no debe estar vacío',
  })
  challenge: string;
}
