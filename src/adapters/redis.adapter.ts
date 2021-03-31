import { IoAdapter } from '@nestjs/platform-socket.io';
import { REDIS } from 'config/dotenv';
import { SOCKET_DB } from 'constants/redis';
import * as redisIoAdapter from 'socket.io-redis';


export class RedisIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: any): any {
    const server = super.createIOServer(port, options);
    const redisAdapter = redisIoAdapter({
      host: REDIS.HOST,
      port: REDIS.PORT,
      db: SOCKET_DB,
    });

    server.adapter(redisAdapter);

    return server;
  }
}