import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ParticipationRounded } from 'src/entities/participationRounded.entity';
import { Rounders } from 'src/entities/rounded.entity';
import { Users } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import { CreateRoundedPrivateDto } from './Dtos/createRoundedPrivateDto';
import { RoundOfStatus } from 'src/enum/roundOfStatus';
import { RoundOfVisibility } from 'src/enum/roundOfVisibility';

@Injectable()
export class RounderRepository {
  @InjectRepository(Rounders)
  private readonly roundedRepository: Repository<Rounders>;
  @InjectRepository(ParticipationRounded)
  private readonly participationRoundersRepository: Repository<ParticipationRounded>;
  async getCountRoundedUserByUuid(id: string) {
    return await this.participationRoundersRepository.count({
      where: {
        user: { id },
        finalizedRounded: false,
      },
    });
  }
  async postCreateRoundedPrivateRepository(
    createRoundedPrivateDto: CreateRoundedPrivateDto,
    user: Users,
  ) {
    const newRounded = this.roundedRepository.create({
      createDate: new Date(),
      numberOfRounds: createRoundedPrivateDto.numberOfRounds,
      payOfRounds: createRoundedPrivateDto.payOfRounds,
      numberOfParticipants: createRoundedPrivateDto.numberOfParticipants,
      numberActualOfParticipants: 1,
      durationOfRound: createRoundedPrivateDto.durationOfRounds,
      lastDatePayOfRound: null,
      numberMaxOfRounds: createRoundedPrivateDto.numberOfRounds,
      numberActualOfRounds: 0,
      status: RoundOfStatus.CREATED,
      visibility: RoundOfVisibility.PRIVATE,
    });
    const newRoundedSave = await this.roundedRepository.save(newRounded);
    const newParticipationRounded = this.participationRoundersRepository.create(
      {
        user: user,
        rounder: newRoundedSave,
        finalizedRounded: false,
      },
    );
    await this.participationRoundersRepository.save(newParticipationRounded);
    console.log(
      'Ronda privada creada por el usuario:',
      user.email,
      'ID de la ronda:',
      newRoundedSave.id,
    );
    return 'Ronda privada creada con éxito';
  }
}
