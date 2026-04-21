import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // Включаем CORS
  app.enableCors({
    origin: 'http://localhost', // Адрес фронтенда на Vite
    credentials: true,
  });
  await app.listen(5000);
}
bootstrap();
