import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MYSQL } from 'config/dotenv';
import entities from 'entities';
import { Database } from './database.model';

export class MySQL extends Database {
  constructor() {
    super();
  }

  protected composeOptions(): TypeOrmModuleOptions {
    const {
      HOST,
      PORT,
      USERNAME,
      PASSWORD,
      DATABASE,
      SYNC } = MYSQL;

    return {
      type: 'mysql',
      host: HOST,
      port: PORT,
      username: USERNAME,
      password: PASSWORD,
      database: DATABASE,
      synchronize: SYNC,
      entities: [
        entities,
      ],
    }
  }

}