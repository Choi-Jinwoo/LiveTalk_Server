import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as _ from 'lodash';

export abstract class Database {
  protected abstract composeOptions(): TypeOrmModuleOptions;

  options() {
    return _.cloneDeep(this.composeOptions());
  }
}