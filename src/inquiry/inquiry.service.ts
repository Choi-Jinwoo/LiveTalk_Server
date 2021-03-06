import { Injectable } from '@nestjs/common';
import { AuditorService } from 'auditor/auditor.service';
import { Inquiry } from 'entities/inquiry.entity';
import { User } from 'entities/user.entity';
import { DataNotFoundError } from 'errors/data-not-found.error';
import { ErrorCode } from 'errors/error-code.enum';
import { PermissionDenied } from 'errors/permission-denied.error';
import { LectureService } from 'lecture/lecture.service';
import { Page } from 'utils/page/page.util';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { InquiryRepository } from './inquiry.repository';
import { InquiryRo } from './ro/inquiry.ro';

@Injectable()
export class InquiryService {
  constructor(
    private readonly inquiryRepository: InquiryRepository,
    private readonly lectureService: LectureService,
    private readonly auditorService: AuditorService,
  ) { }

  async findWithPagination(adminCode: string, page: number, take: number) {
    const lecture = await this.lectureService.findOrFailByAdminCode(adminCode);
    const inquires = await this.inquiryRepository.findByLectureWithUser(lecture.id, new Page(page, take));
    const inquiryRoList = [];
    for (const inquiry of inquires) {
      inquiry.lecture = lecture;

      const inquiryRo = InquiryRo.fromInquiry(inquiry);
      if (inquiry.isAnonymity) {
        inquiryRo.user = null;
      }

      inquiryRoList.push(inquiryRo);
    }

    // 시간의 흐름에 맞게 reverse 하여 Return
    inquiryRoList.reverse();
    return inquiryRoList;
  }

  async create(user: User, createInquiryDto: CreateInquiryDto): Promise<Inquiry> {
    const { lectureId } = createInquiryDto;
    const lecture = await this.lectureService.findOne(lectureId);
    if (lecture === undefined) {
      throw new DataNotFoundError(ErrorCode.LECTURE_NOT_FOUND);
    }

    const isJoined = this.auditorService.isJoined(user, lecture);
    if (!isJoined) {
      throw new PermissionDenied(ErrorCode.NOT_LECTURE_AUDITOR);
    }

    const inquiry = this.inquiryRepository.create(createInquiryDto);
    inquiry.lecture = lecture;
    inquiry.user = user;

    this.inquiryRepository.save(inquiry);

    return inquiry;
  }
}
