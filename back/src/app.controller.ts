import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  healthCheck(): {
    status: string;
    timestamp: string;
    port: string;
    env: string;
  } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      port: process.env.PORT || '3002',
      env: process.env.NODE_ENV || 'development',
    };
  }
}
