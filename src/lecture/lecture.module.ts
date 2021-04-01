import { forwardRef, Module } from '@nestjs/common';
import { LectureService } from './lecture.service';
import { LectureController } from './lecture.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LectureRepository } from './lecture.repository';
import { AuditorModule } from 'auditor/auditor.module';
import { InquiryModule } from 'inquiry/inquiry.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LectureRepository,
    ]),
    AuditorModule,
    forwardRef(() => InquiryModule),
  ],
  providers: [LectureService],
  exports: [LectureService],
  controllers: [LectureController],
})
export class LectureModule { }
