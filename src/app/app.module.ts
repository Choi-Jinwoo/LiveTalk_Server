import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'auth/auth.module';
import { DatabaseTypes } from 'database/database.enum';
import { DatabaseFactory } from 'database/database.factory';
import { UserModule } from 'user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(
      DatabaseFactory.createDatabase(DatabaseTypes.MYSQL).options(),
    ),
    UserModule,
    AuthModule,
  ],
})
export class AppModule { }
