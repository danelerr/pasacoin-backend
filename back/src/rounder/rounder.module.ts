import { Module } from '@nestjs/common';
import { RounderController } from './rounder.controller';
import { RounderService } from './rounder.service';
import { RounderRepository } from './rounder.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { UsersModule } from 'src/users/users.module';
import { Rounders } from 'src/entities/rounded.entity';
import { ParticipationRounded } from 'src/entities/participationRounded.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Rounders, ParticipationRounded]),
    UsersModule,
  ],
  controllers: [RounderController],
  providers: [RounderService, RounderRepository],
  exports: [RounderService, TypeOrmModule],
})
export class RounderModule {}
