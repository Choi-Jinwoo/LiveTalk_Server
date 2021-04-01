import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LectureModule } from 'lecture/lecture.module';
import { LectureRepository } from 'lecture/lecture.repository';
import { InquiryRepository } from './inquiry.repository';
import { InquiryService } from './inquiry.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InquiryRepository,
      LectureRepository,
    ]),
    LectureModule,
  ],
  providers: [InquiryService],
  exports: [InquiryService],
})
export class InquiryModule { }
