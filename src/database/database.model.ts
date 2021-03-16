import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import _ from 'lodash';

export abstract class Database {
  protected abstract composeOptions(): TypeOrmModuleOptions;

  options() {
    return this.composeOptions();
  }
}