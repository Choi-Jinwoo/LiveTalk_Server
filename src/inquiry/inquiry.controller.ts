import { Controller, Get, Query } from '@nestjs/common';
import { StringIterator } from 'lodash';
import { BaseResponse } from 'models/http/base.response';
import { InquiryService } from './inquiry.service';

@Controller('inquiry')
export class InquiryController {

  constructor(
    private readonly inquiryService: InquiryService,
  ) { }

  @Get()
  async find(
    @Query('page') page: number,
    @Query('take') take: number,
    @Query('adminCode') adminCode: string,
  ) {
    const inquiries =
      await this.inquiryService.findWithPagination(adminCode, page, take);

    return BaseResponse.object('질문 조회 성공', {
      inquiries,
    });
  }
}
