import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGlobal } from './middlewares/loggerGlobal';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const PORT = process.env.PORT || 3002;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins = process.env.DOMAIN_FRONT?.split(',').map((origin) =>
    origin.trim(),
  ) || ['*'];

  app.use(loggerGlobal);
  console.log('Allowed origins:', allowedOrigins);

  app.enableCors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  app.useGlobalPipes(new ValidationPipe());
  const options = new DocumentBuilder()
    .setTitle('Backend PasaCoin')
    .setDescription('Endpoints del backend de PasaCoin')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  await app.listen(PORT, '0.0.0.0');
  console.log(`✅ Servidor corriendo exitosamente en puerto ${PORT}`);
  console.log(`🏥 Health check: http://0.0.0.0:${PORT}/health`);
}
void bootstrap();
