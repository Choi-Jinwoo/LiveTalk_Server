import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditorModule } from 'auditor/auditor.module';
import { LectureModule } from 'lecture/lecture.module';
import { InquiryRepository } from './inquiry.repository';
import { InquiryService } from './inquiry.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InquiryRepository,
    ]),
    LectureModule,
    AuditorModule,
  ],
  providers: [InquiryService],
  exports: [InquiryService],
})
export class InquiryModule { }
