import { Injectable } from '@nestjs/common';
import { REDIS } from 'config/dotenv';
import { promisify } from 'util';
import { RedisClient, createClient } from 'redis';

@Injectable()
export class RedisClientService {
  private readonly tokenClient: RedisClient;
  readonly socketClient: RedisClient;

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

  initSocket(cb: Function) {
    this.socketClient.flushall((err, success) => {
      cb();
    });
  }

  async setToken(id: string, token: string) {
    const setAsync = promisify(this.tokenClient.set).bind(this.tokenClient);

    await setAsync(id, token)
  }

  async getSocket(id: string): Promise<string | null> {
    const getAsync = promisify(this.socketClient.get).bind(this.socketClient);

    return getAsync(id);
  }

  async setSocket(id: string, socketId: string) {
    const setAsync = promisify(this.socketClient.set).bind(this.socketClient);

    await setAsync(id, socketId);
  }

  removeSocket(id: string) {
    this.socketClient.del(id);
  }
}
