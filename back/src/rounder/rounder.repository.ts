import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ParticipationRounded } from 'src/entities/participationRounded.entity';
import { Rounders } from 'src/entities/rounded.entity';
import { Users } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import { CreateRoundedPrivateDto } from './Dtos/createRoundedPrivateDto';
import { RoundOfStatus } from 'src/enum/roundOfStatus';
import { RoundOfVisibility } from 'src/enum/roundOfVisibility';
import { CreateRoundedPublicDto } from './Dtos/createRoundedPublicDto';

@Injectable()
export class RounderRepository {
  @InjectRepository(Rounders)
  private readonly roundedRepository: Repository<Rounders>;
  @InjectRepository(ParticipationRounded)
  private readonly participationRoundersRepository: Repository<ParticipationRounded>;
  async getAllRoundedPublicCreatedRepository() {
    return await this.roundedRepository.find({
      where: {
        visibility: RoundOfVisibility.PUBLIC,
        status: RoundOfStatus.CREATED,
      },
    });
  }
  async getAllRoundedUsersRepository(user: Users) {
    return await this.participationRoundersRepository
      .createQueryBuilder('participation')
      .leftJoinAndSelect('participation.rounder', 'rounder')
      .where('participation.user = :userId', { userId: user.id })
      .andWhere('rounder.status IN (:...statuses)', {
        statuses: [RoundOfStatus.IN_PROGRESS, RoundOfStatus.CREATED],
      })
      .getMany();
  }
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
      numberOfParticipants: createRoundedPrivateDto.numberOfRounds,
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

  async postCreateRoundedPublicRepository(
    createRoundedPublicDto: CreateRoundedPublicDto,
    user: Users,
  ) {
    const newRoundedPublic = this.roundedRepository.create({
      createDate: new Date(),
      numberOfRounds: createRoundedPublicDto.numberOfRounds,
      payOfRounds: createRoundedPublicDto.payOfRounds,
      numberOfParticipants: createRoundedPublicDto.numberOfRounds,
      numberActualOfParticipants: 0,
      durationOfRound: createRoundedPublicDto.durationOfRounds,
      lastDatePayOfRound: null,
      numberMaxOfRounds: createRoundedPublicDto.numberOfRounds,
      numberActualOfRounds: 0,
      status: RoundOfStatus.CREATED,
      visibility: RoundOfVisibility.PUBLIC,
    });
    const newRoundedPublicSave =
      await this.roundedRepository.save(newRoundedPublic);
    console.log(
      'Ronda pública creada por el usuario:',
      user.email,
      'ID de la ronda:',
      newRoundedPublicSave.id,
    );
    return 'Ronda pública creada con éxito';
  }
}
