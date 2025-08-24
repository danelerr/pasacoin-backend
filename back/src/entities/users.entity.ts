import { Rol } from 'src/enum/rol.enum';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ParticipationRounded } from './participationRounded.entity';

@Entity({ name: 'users' })
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: true, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  password: string;

  @Column({ type: 'varchar', length: 100, nullable: true, unique: true })
  wallet: string;

  @Column({ type: 'float', default: 0 })
  reputation: number;

  @Column({ type: 'enum', enum: Rol, default: Rol.USER })
  rol: Rol;

  @OneToMany(() => ParticipationRounded, (p: ParticipationRounded) => p.user)
  participations: ParticipationRounded[];
}
