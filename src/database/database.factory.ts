import { DatabaseTypes } from './database.enum';
import { Database } from './database.model';
import { MySQL } from './mysql.model';

export class DatabaseFactory {
  static createDatabase(type: DatabaseTypes): Database {
    switch (type) {
      case DatabaseTypes.MYSQL:
        return new MySQL();
    }
  }
}