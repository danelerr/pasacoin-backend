import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RounderModule } from './rounder/rounder.module';
import { ReputationModule } from './reputation/reputation.module';

@Module({
  imports: [UsersModule, RounderModule, ReputationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
