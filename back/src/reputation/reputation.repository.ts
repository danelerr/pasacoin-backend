import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ReputationRepository {
  getReputation() {
    throw new BadRequestException('endpoint no implementado');
  }
}
