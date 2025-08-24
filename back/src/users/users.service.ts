import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto } from './Dtos/registerUser.Dto';
import { UsersRepository } from './users.repository';
import { LoginUserDto } from './Dtos/loginUser.Dto';
import * as bcrypt from 'bcrypt';
import { InformationUserDto } from './Dtos/informationUser.Dto';
import { UpdateUserDto } from './Dtos/updateUser.Dto';
import { isAddress, verifyMessage } from 'ethers';
import { LoginWalletUserDto } from './Dtos/loginWalletUserDto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  async getRegisterWithWalletService(address: string) {
    if (!(isAddress as (value: string) => boolean)(address)) {
      throw new BadRequestException('La dirección no es una wallet EVM válida');
    }
    const userExisting = await this.userRepository.getUserByWallet(address);
    if (userExisting) {
      throw new BadRequestException('Esta wallet ya está registrada');
    }
    return this.userRepository.registerUserWithWalletRepository(address);
  }
  // servicio para iniciar sesion

  async loginUserService(loginUserDto: LoginUserDto) {
    if (!loginUserDto.email || !loginUserDto.password) {
      throw new BadRequestException('Email y contraseña son requeridos');
    }
    const user = await this.userRepository.getUserByEmail(loginUserDto.email);
    if (!user) {
      throw new UnauthorizedException('email o contraseña incorrecta');
    }
    const passwordUser = loginUserDto.password;

    const isPasswordValid = await bcrypt.compare(passwordUser, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('email o contraseña incorrecta');
    }
    return this.userRepository.loginUserRepository(user);
  }
  //servicio para registrar un usuario
  async registerUserService(registerUserDto: RegisterUserDto) {
    const userExisting = await this.userRepository.getUserByEmail(
      registerUserDto.email,
    );
    if (userExisting) {
      throw new BadRequestException('Este email ya está registrado');
    }
    return await this.userRepository.registerUserRepository(registerUserDto);
  }
  //servicio para obtener la informacion del usuario
  async postInformationUserService(informationUserDto: InformationUserDto) {
    const user = await this.userRepository.getUserByUuid(informationUserDto.id);
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }
    return this.userRepository.postInformationUserRepository(user);
  }
  //servicio para actualizar la informacion del usuario
  async putUpdateUserService(updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.getUserByUuid(updateUserDto.id);
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }
    return this.userRepository.putUpdateUserRepository(updateUserDto, user);
  }

  async loginWithWalletService(loginWalletUserDto: LoginWalletUserDto) {
    const { address, signature, challenge } = loginWalletUserDto;

    if (!(isAddress as (value: string) => boolean)(address)) {
      throw new BadRequestException('La dirección no es una wallet EVM válida');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const recoveredAddress = verifyMessage(challenge, signature);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      throw new BadRequestException('Firma inválida');
    }

    const user = await this.userRepository.getUserByWallet(address);
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    return {
      id: user.id,
      rol: user.rol,
    };
  }

  async generateWalletChallenge(address: string) {
    const user = await this.userRepository.getUserByWallet(address);
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }
    const challenge = `Login to PasaCoin at ${Date.now()} with wallet ${address}`;
    return await this.userRepository.saveWalletChallenge(address, challenge);
  }
}
