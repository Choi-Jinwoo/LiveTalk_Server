import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { PORT } from 'config/dotenv';
import { ValidationPipe } from '@nestjs/common';
import { HttpErrorFilter } from 'filter/http-error.filter';
import { SocketErrorFilter } from 'filter/socket-error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpErrorFilter(), new SocketErrorFilter());
  await app.listen(PORT);
}
bootstrap();
