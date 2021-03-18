import { Body, Controller, Post, Request } from '@nestjs/common';
import { Request as RequestType } from 'express';
import { BaseResponse } from 'models/http/base.response';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { JoinLectureDto } from './dto/join-lecture.dto';
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

  @Post('join')
  async join(
    @Request() req: RequestType,
    @Body() joinLectureDto: JoinLectureDto): Promise<BaseResponse> {
    const { user } = req;
    await this.lectureService.join(user, joinLectureDto);

    return BaseResponse.object('강의 참여 성공');
  }
}
