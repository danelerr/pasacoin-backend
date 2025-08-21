import { RoundOfStatus } from 'src/enum/roundOfStatus';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'rounders',
})
export class Rounders {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'date',
    nullable: false,
    default: () => 'CURRENT_DATE',
  })
  createDate: Date;

  @Column({
    type: 'int',
    nullable: false,
  })
  numberOfRounds: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  payOfRounds: number;
  @Column({
    type: 'int',
    nullable: false,
  })
  numberOfParticipants: number;
  @Column({
    type: 'int',
    nullable: false,
  })
  durationOfRound: number; // in days
  @Column({
    type: 'date',
    nullable: true,
    default: null,
  })
  lastDatePayOfRound: Date | null; // last date when the pay of round was made
  @Column({
    type: 'int',
    nullable: false,
  })
  numberMaxOfRounds: number; // maximum number of rounds that can be created
  @Column({
    type: 'int',
    nullable: false,
    default: 0,
  })
  numberActualOfRounds: number; // current number of rounds created

  @Column({
    type: 'enum',
    enum: RoundOfStatus,
  })
  status: RoundOfStatus; // status of the round (private or public)
}
