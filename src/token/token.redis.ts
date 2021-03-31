import { Injectable } from '@nestjs/common';
import { REDIS } from 'config/dotenv';
import { promisify } from 'util';
import { createClient, RedisClient } from 'redis';
import { TOKEN_DB } from 'constants/redis';

@Injectable()
export class TokenRedis {
  private readonly tokenClient: RedisClient;

  constructor() {
    this.tokenClient = createClient({
      host: REDIS.HOST,
      port: REDIS.PORT,
      db: TOKEN_DB,
    });
  }

  async set(id: string, token: string) {
    const setAsync = promisify(this.tokenClient.set).bind(this.tokenClient);

    await setAsync(id, token)
  }

  async get(id: string): Promise<string | null> {
    const getAsync = promisify(this.tokenClient.get).bind(this.tokenClient);

    return getAsync(id);
  }
}