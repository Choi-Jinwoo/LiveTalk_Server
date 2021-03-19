import { Injectable } from '@nestjs/common';
import { REDIS } from 'config/dotenv';
import { RedisClient, createClient } from 'redis';

@Injectable()
export class RedisClientService {
  private readonly tokenClient: RedisClient;
  private readonly socketClient: RedisClient;

  constructor() {
    this.tokenClient = createClient({
      host: REDIS.HOST,
      port: REDIS.PORT,
      db: 0,
    });

    this.socketClient = createClient({
      host: REDIS.HOST,
      port: REDIS.PORT,
      db: 1,
    });
  }

  setToken(id: string, token: string) {
    this.tokenClient.set(id, token);
  }

  setSocket(id: string, socketId: string) {
    this.socketClient.set(id, socketId);
  }
}
