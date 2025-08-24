import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService, DataLoaderService } from './app.service';
import { UsersModule } from './users/users.module';
import { RounderModule } from './rounder/rounder.module';
import { ReputationModule } from './reputation/reputation.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from './config/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('typeorm') ?? {},
    }),
    UsersModule,
    RounderModule,
    ReputationModule,
  ],
  controllers: [AppController],
  providers: [AppService, DataLoaderService],
})
export class AppModule {}
