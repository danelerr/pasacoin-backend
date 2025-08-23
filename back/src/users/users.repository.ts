import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './Dtos/registerUser.Dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './Dtos/updateUser.Dto';

@Injectable()
export class UsersRepository {
  @InjectRepository(Users) private readonly userRepository: Repository<Users>;

  //metodo para iniciar sesion
  loginUserRepository(user: Users) {
    const userLogin = {
      id: user.id,
      email: user.email,
      rol: user.rol,
    };
    console.log('Usuario logueado:', user.email);
    return userLogin;
  }
  //metodo para registrar un usuario
  async registerUserRepository(registerUserDto: RegisterUserDto) {
    const passwordUser = registerUserDto.password;

    const saltOrRounds = 10;
    const passwordHash = await bcrypt.hash(passwordUser, saltOrRounds);

    const newUser = this.userRepository.create({
      ...registerUserDto,
      password: passwordHash,
    });
    await this.userRepository.save(newUser);
    console.log('Usuario registrado:', newUser.email);
    return 'Registro realizado con éxito';
  }
  //metodo para obtener un usuario por email
  async getUserByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
    });
  }
  //metodo para obtener un usuario por uuid
  async getUserByUuid(idUser: string) {
    return await this.userRepository.findOne({
      where: { id: idUser },
    });
  }
  //metodo para obtener la informacion del usuario
  postInformationUserRepository(user: Users) {
    const userInformation = {
      id: user.id,
      name: user.name,
      email: user.email,
      reputation: user.reputation,
      rol: user.rol,
    };
    console.log('Información del usuario obtenida:', user.email);
    return userInformation;
  }
  //metodo para actualizar la informacion del usuario
  async putUpdateUserRepository(updateUserDto: UpdateUserDto, user: Users) {
    user.name = updateUserDto.name;
    await this.userRepository.save(user);
    console.log('Información del usuario actualizada:', user.email);
    return 'Información actualizada con éxito';
  }
}
