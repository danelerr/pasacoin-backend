import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository {
  getUsers() {
    throw new BadRequestException('endpoint no implementado');
  }
}
