import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InquiryRepository } from './inquiry.repository';
import { InquiryService } from './inquiry.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InquiryRepository,
    ]),
  ],
  providers: [InquiryService]
})
export class InquiryModule { }
