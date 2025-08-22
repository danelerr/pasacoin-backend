import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Users } from './users.entity';
import { Rounders } from './rounded.entity';

@Entity({ name: 'participation_rounded' })
@Index(['user', 'rounder'], { unique: true }) // opcional: evita duplicados user+rounder
export class ParticipationRounded {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  finalizedRounded: boolean;

  @Column({ type: 'int', nullable: false, default: 0 })
  roundedStart: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  roundedEnd: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  calificationRounded: number;

  @ManyToOne(() => Users, (user: Users) => user.participations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(() => Rounders, (rounder: Rounders) => rounder.participations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'rounder_id' })
  rounder: Rounders;
}
