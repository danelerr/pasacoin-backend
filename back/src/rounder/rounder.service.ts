import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateRoundedPrivateDto } from './Dtos/createRoundedPrivateDto';
import { RounderRepository } from './rounder.repository';
import { UsersRepository } from 'src/users/users.repository';

@Injectable()
export class RounderService {
  constructor(
    private readonly roundedRepository: RounderRepository,
    private readonly userRepository: UsersRepository,
  ) {}
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
    if (
      createRoundedPrivateDto.numberOfRounds !==
      createRoundedPrivateDto.numberOfParticipants
    ) {
      throw new BadRequestException(
        'El número de participantes debe ser igual al número de rondas',
      );
    }
    return await this.roundedRepository.postCreateRoundedPrivateRepository(
      createRoundedPrivateDto,
      user,
    );
  }
}
