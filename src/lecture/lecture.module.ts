import { Module } from '@nestjs/common';
import { LectureService } from './lecture.service';
import { LectureController } from './lecture.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LectureRepository } from './lecture.repository';
import { TokenModule } from 'token/token.module';
import { LectureGateway } from 'lecture/lecture.gateway';
import { AuditorModule } from 'auditor/auditor.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LectureRepository,
    ]),
    TokenModule,
    AuditorModule,
  ],
  providers: [LectureService, LectureGateway],
  exports: [LectureService],
  controllers: [LectureController],
})
export class LectureModule { }
