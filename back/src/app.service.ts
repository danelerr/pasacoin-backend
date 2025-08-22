import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Bienvenido a la API de PasaCoin';
  }
}

@Injectable()
export class DataLoaderService implements OnModuleInit {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
  ) {}
  async onModuleInit() {
    const userCount = await this.userRepository.count();
    if (userCount === 0) {
      console.log('⏳ Cargando usuarios iniciales...');
      const queryRunner =
        this.userRepository.manager.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        const rawData = fs.readFileSync('./src/utils/users/data.json', 'utf-8');
        const users: Partial<Users>[] = JSON.parse(rawData) as Partial<Users>[];
        await Promise.all(
          users.map(async (user) => {
            const newUser = this.userRepository.create({
              name: user.name,
              email: user.email,
              password: user.password,
              walletAddress: user.walletAddress,
              privateKey: user.privateKey,
              reputation: user.reputation,
              rol: user.rol,
            });
            const savedUser = await this.userRepository.save(newUser);
            console.log(`Usuario ${savedUser.name} creado con éxito.`);
          }),
        );
        await queryRunner.commitTransaction();
        console.log('✅ Usuarios iniciales cargados correctamente.');
      } catch (error) {
        console.error('❌ Error al precargar los usuarios:', error);
        await queryRunner.rollbackTransaction();
      } finally {
        await queryRunner.release();
      }
    } else {
      console.log('✔ Los usuarios ya existen en la base de datos.');
    }
  }
}
