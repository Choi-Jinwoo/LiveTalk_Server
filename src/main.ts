import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { PORT } from 'config/dotenv';
import { ValidationPipe } from '@nestjs/common';
import { HttpErrorFilter } from 'filter/http-error.filter';
import { SocketErrorFilter } from 'filter/socket-error.filter';
import { getFromContainer } from 'typeorm';
import { RedisClientService } from 'redis-client/redis-client.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpErrorFilter(), new SocketErrorFilter());

  const redisClientService = getFromContainer(RedisClientService);
  redisClientService.initSocket(async () => {
    await app.listen(PORT);
  });
}
bootstrap();
