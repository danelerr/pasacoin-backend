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

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}
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
}
