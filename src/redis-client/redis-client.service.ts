import { Injectable } from '@nestjs/common';
import { REDIS } from 'config/dotenv';
import { RedisClient, createClient } from 'redis';

@Injectable()
export class RedisClientService {
  private readonly redisClient: RedisClient;

  constructor() {
    this.redisClient = createClient({
      host: REDIS.HOST,
      port: REDIS.PORT,
      db: REDIS.DB,
    });
  }

  set(key: string, value: string) {
    this.redisClient.set(key, value);
  }
}
