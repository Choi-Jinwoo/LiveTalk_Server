import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditorModule } from 'auditor/auditor.module';
import { AuthModule } from 'auth/auth.module';
import { DatabaseTypes } from 'database/database.enum';
import { DatabaseFactory } from 'database/database.factory';
import { LectureModule } from 'lecture/lecture.module';
import { TokenModule } from 'token/token.module';
import { UserModule } from 'user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(
      DatabaseFactory.createDatabase(DatabaseTypes.MYSQL).options(),
    ),
    UserModule,
    AuthModule,
    TokenModule,
    LectureModule,
    AuditorModule,
  ],
})
export class AppModule { }
