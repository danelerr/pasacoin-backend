import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'participationRounded',
})
export class ParticipationRounded {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
