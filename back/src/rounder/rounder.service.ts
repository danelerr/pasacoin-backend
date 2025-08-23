import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateRoundedPrivateDto } from './Dtos/createRoundedPrivateDto';
import { RounderRepository } from './rounder.repository';
import { UsersRepository } from 'src/users/users.repository';
import { CreateRoundedPublicDto } from './Dtos/createRoundedPublicDto';
import { Rol } from 'src/enum/rol.enum';

@Injectable()
export class RounderService {
  constructor(
    private readonly roundedRepository: RounderRepository,
    private readonly userRepository: UsersRepository,
  ) {}
  async getAllRoundedPublicCreatedService() {
    return await this.roundedRepository.getAllRoundedPublicCreatedRepository();
  }
  async getAllRoundedUsersService(id: string) {
    const user = await this.userRepository.getUserByUuid(id);
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }
    return await this.roundedRepository.getAllRoundedUsersRepository(user);
  }
  async postCreateRoundedPrivateService(
    createRoundedPrivateDto: CreateRoundedPrivateDto,
  ) {
    const user = await this.userRepository.getUserByUuid(
      createRoundedPrivateDto.id,
    );
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }
    const roundedExisting =
      await this.roundedRepository.getCountRoundedUserByUuid(
        createRoundedPrivateDto.id,
      );
    if (roundedExisting >= 3) {
      throw new BadRequestException(
        'No puedes crear más rondas privadas, estas participando en 3 rondas sin finalizar',
      );
    }
    if (
      createRoundedPrivateDto.numberOfRounds < 3 ||
      createRoundedPrivateDto.numberOfRounds > 10
    ) {
      throw new BadRequestException(
        'El número de rondas debe estar entre 3 y 10',
      );
    }
    if (
      createRoundedPrivateDto.payOfRounds > 100 ||
      createRoundedPrivateDto.payOfRounds < 1
    ) {
      throw new ConflictException(
        'El pago por ronda no puede ser mayor a 100 usdm ni menor a 1 usdm',
      );
    }
    if (
      createRoundedPrivateDto.durationOfRounds < 7 ||
      createRoundedPrivateDto.durationOfRounds > 30
    ) {
      throw new BadRequestException(
        'La duración de las rondas debe estar entre 7 y 30 días',
      );
    }

    return await this.roundedRepository.postCreateRoundedPrivateRepository(
      createRoundedPrivateDto,
      user,
    );
  }

  async postCreateRoundedPublicService(
    createRoundedPublicDto: CreateRoundedPublicDto,
  ) {
    const user = await this.userRepository.getUserByUuid(
      createRoundedPublicDto.id,
    );
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }
    if (user.rol !== Rol.ADMIN) {
      throw new BadRequestException(
        'No tienes permisos para crear una ronda pública',
      );
    }
    if (
      createRoundedPublicDto.numberOfRounds < 3 ||
      createRoundedPublicDto.numberOfRounds > 24
    ) {
      throw new BadRequestException(
        'El número de rondas debe estar entre 3 y 24',
      );
    }

    if (
      createRoundedPublicDto.numberOfRounds *
        createRoundedPublicDto.durationOfRounds >
      365
    ) {
      throw new BadRequestException(
        'La combinación de número de rondas y duración no puede superar los 12 meses (365 días)',
      );
    }
    if (
      createRoundedPublicDto.payOfRounds > 1000 ||
      createRoundedPublicDto.payOfRounds < 1
    ) {
      throw new ConflictException(
        'El pago por ronda no puede ser mayor a 1000 usdm ni menor a 1 usdm',
      );
    }
    return await this.roundedRepository.postCreateRoundedPublicRepository(
      createRoundedPublicDto,
      user,
    );
  }
}
