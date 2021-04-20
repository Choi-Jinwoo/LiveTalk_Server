import { forwardRef, Module } from '@nestjs/common';
import { LectureService } from './lecture.service';
import { LectureController } from './lecture.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LectureRepository } from './lecture.repository';
import { AuditorModule } from 'auditor/auditor.module';
import { InquiryModule } from 'inquiry/inquiry.module';
import { TokenModule } from 'token/token.module';
import { UserModule } from 'user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LectureRepository,
    ]),
    AuditorModule,
    TokenModule,
    UserModule,
    forwardRef(() => InquiryModule),
  ],
  providers: [LectureService],
  exports: [LectureService],
  controllers: [LectureController],
})
export class LectureModule { }
