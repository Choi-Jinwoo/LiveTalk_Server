import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseTypes } from 'database/database.enum';
import { DatabaseFactory } from 'database/database.factory';
import { MySQL } from 'database/mysql.model';

@Module({
  imports: [
    TypeOrmModule.forRoot(
      DatabaseFactory.createDatabase(DatabaseTypes.MYSQL).options(),
    ),
  ],
})
export class AppModule { }
