import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class RounderRepository {
  getRounder() {
    throw new BadRequestException('endpoint no implementado');
  }
}
