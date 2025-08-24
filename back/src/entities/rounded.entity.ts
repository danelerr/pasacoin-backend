import { RoundOfStatus } from 'src/enum/roundOfStatus';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ParticipationRounded } from './participationRounded.entity';
import { RoundOfVisibility } from 'src/enum/roundOfVisibility';

@Entity({ name: 'rounders' })
export class Rounders {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ type: 'date', nullable: false, default: () => 'CURRENT_DATE' })
  createDate: Date;

  @Column({ type: 'int', nullable: false })
  numberOfRounds: number;

  @Column({ type: 'int', nullable: false })
  payOfRounds: number;

  @Column({ type: 'int', nullable: false })
  numberOfParticipants: number;

  @Column({ type: 'int', nullable: false })
  numberActualOfParticipants: number;

  @Column({ type: 'int', nullable: false })
  durationOfRound: number;

  @Column({ type: 'date', nullable: true, default: null })
  lastDatePayOfRound: Date | null;

  @Column({ type: 'int', nullable: false })
  numberMaxOfRounds: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  numberActualOfRounds: number;

  @Column({ type: 'enum', enum: RoundOfStatus })
  status: RoundOfStatus;
  @Column({
    type: 'enum',
    enum: RoundOfVisibility,
  })
  visibility: RoundOfVisibility;

  @OneToMany(
    () => ParticipationRounded,
    (participation: ParticipationRounded) => participation.rounder,
  )
  participations: ParticipationRounded[];
}
