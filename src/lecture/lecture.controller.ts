import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { SubscribeMessage } from '@nestjs/websockets';
import { ReqUser } from 'decorators/req-user.decorator';
import { User } from 'entities/user.entity';
import { HttpAuthGuard } from 'guards/auth/http-auth.guard';
import { BaseResponse } from 'models/http/base.response';
import { CloseLectureDto } from './dto/close-lecture.dto';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { JoinLectureDto } from './dto/join-lecture.dto';
import { LectureGateway } from './lecture.gateway';
import { LectureService } from './lecture.service';

@Controller('lecture')
export class LectureController {
  constructor(
    private readonly lectureService: LectureService,
    private readonly lectureGateway: LectureGateway,
  ) { }

  @Post()
  async create(@Body() createLectureDto: CreateLectureDto): Promise<BaseResponse> {
    const lecture = await this.lectureService.create(createLectureDto);

    return BaseResponse.object('강의 생성 성공', {
      lecture,
    });
  }

  @Post('join')
  @UseGuards(HttpAuthGuard)
  async join(
    @ReqUser() user: User,
    @Body() joinLectureDto: JoinLectureDto): Promise<BaseResponse> {
    await this.lectureService.join(user, joinLectureDto);

    return BaseResponse.object('강의 참여 성공');
  }

  @Post('close')
  async close(
    @Body() closeLectureDto: CloseLectureDto): Promise<BaseResponse> {
    const lecture = await this.lectureService.close(closeLectureDto);
    this.lectureGateway.emitClose(lecture);

    return BaseResponse.object('강의 종료 성공');
  }
}
