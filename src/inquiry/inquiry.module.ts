import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditorModule } from 'auditor/auditor.module';
import { LectureModule } from 'lecture/lecture.module';
import { TokenModule } from 'token/token.module';
import { UserModule } from 'user/user.module';
import { InquiryGateway } from './inquiry.gateway';
import { InquiryRepository } from './inquiry.repository';
import { InquiryService } from './inquiry.service';
import { InquiryController } from './inquiry.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InquiryRepository,
    ]),
    forwardRef(() => LectureModule),
    AuditorModule,
    TokenModule,
    UserModule,
  ],
  providers: [InquiryService, InquiryGateway],
  exports: [InquiryService, InquiryGateway],
  controllers: [InquiryController],
})
export class InquiryModule { }
