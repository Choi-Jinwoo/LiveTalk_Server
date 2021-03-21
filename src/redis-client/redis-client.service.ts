import { Injectable } from '@nestjs/common';
import { REDIS } from 'config/dotenv';
import { promisify } from 'util';
import { RedisClient, createClient } from 'redis';

@Injectable()
export class RedisClientService {
  private readonly tokenClient: RedisClient;
  private readonly socketClient: RedisClient;

  readonly getSocket: Function;

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

    this.getSocket = promisify(this.socketClient.hmget).bind(this.socketClient);
  }

  initSocket(cb: Function) {
    this.socketClient.flushall((err, success) => {
      cb();
    });
  }

  setToken(id: string, token: string) {
    this.tokenClient.set(id, token);
  }

  setSocket(id: string, socketId: string, clientIndex: number) {
    this.socketClient.hmset(id, {
      socketId,
      clientIndex,
    });
  }

  removeSocket(id: string) {
    this.socketClient.del(id);
  }
}
