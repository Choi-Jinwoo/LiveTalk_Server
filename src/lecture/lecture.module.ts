import { Module } from '@nestjs/common';
import { LectureService } from './lecture.service';
import { LectureController } from './lecture.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LectureRepository } from './lecture.repository';
import { TokenModule } from 'token/token.module';
import { UserRepository } from 'user/user.repository';
import { LectureGateway } from 'lecture/lecture.gateway';
import { AuditorModule } from 'auditor/auditor.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LectureRepository,
      UserRepository
    ]),
    TokenModule,
    AuditorModule,
  ],
  providers: [LectureService, LectureGateway],
  controllers: [LectureController],
})
export class LectureModule { }
