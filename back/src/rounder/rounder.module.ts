import { Module } from '@nestjs/common';
import { RounderController } from './rounder.controller';
import { RounderService } from './rounder.service';

@Module({
  controllers: [RounderController],
  providers: [RounderService]
})
export class RounderModule {}
