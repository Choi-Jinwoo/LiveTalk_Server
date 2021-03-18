import { Body, Controller, Post } from '@nestjs/common';
import { BaseResponse } from 'models/http/base.response';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { LectureService } from './lecture.service';

@Controller('lecture')
export class LectureController {
  constructor(
    private readonly lectureService: LectureService,
  ) { }

  @Post()
  async create(@Body() createLectureDto: CreateLectureDto): Promise<BaseResponse> {
    const lecture = await this.lectureService.create(createLectureDto);

    return BaseResponse.object('강의 생성 성공', {
      lecture,
    });
  }
}
