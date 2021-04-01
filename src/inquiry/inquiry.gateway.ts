import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { AuditorService } from 'auditor/auditor.service';
import { ReqUser } from 'decorators/req-user.decorator';
import { Lecture } from 'entities/lecture.entity';
import { User } from 'entities/user.entity';
import { DataNotFoundError } from 'errors/data-not-found.error';
import { ErrorCode } from 'errors/error-code.enum';
import { PermissionDenied } from 'errors/permission-denied.error';
import { SocketAuthGuard } from 'guards/auth/socket-auth.guard';
import { AnonymityInquiryDto } from 'inquiry/dto/anonymity-inquiry.dto';
import { CreateInquiryDto } from 'inquiry/dto/create-inquiry.dto';
import { InquiryService } from 'inquiry/inquiry.service';
import { IHasRoomGateway } from 'interface/gateway/has-room-gateway.interface';
import { SocketBaseResponse } from 'models/socket/socket-base.response';
import { Server, Socket } from 'socket.io';
import { JoinSpecificLectureDto } from '../lecture/dto/join-specific-lecture.dto';
import { LectureEvents } from './inquiry.event';
import { LectureService } from 'lecture/lecture.service';

@WebSocketGateway({ namespace: 'inquiry' })
@UsePipes(ValidationPipe)
export class InquiryGateway implements IHasRoomGateway {
  constructor(
    private readonly auditorService: AuditorService,
    private readonly lectureService: LectureService,
    private readonly inquiryService: InquiryService,
  ) { }

  @WebSocketServer()
  readonly server!: Server;

  composeRoomName(id: string): string {
    return `lecture-${id}`;
  }

  @SubscribeMessage(LectureEvents.SEND_INQUIRY)
  @UseGuards(SocketAuthGuard)
  async handleSendInquiry(
    @ReqUser() user: User,
    @MessageBody() createInquiryDto: CreateInquiryDto) {

    const inquiry = await this.inquiryService.create(user, createInquiryDto);

    const { lectureId } = inquiry;

    let anonymityInquiry: AnonymityInquiryDto | null = null;
    if (inquiry.isAnonymity === true) {
      anonymityInquiry = new AnonymityInquiryDto();
      anonymityInquiry.id = inquiry.id;
      anonymityInquiry.content = inquiry.content;
      anonymityInquiry.lectureId = inquiry.lectureId;
      anonymityInquiry.lecture = inquiry.lecture;
    }

    this.server
      .to(this.composeRoomName(lectureId))
      .emit(LectureEvents.NEW_INQUIRY, SocketBaseResponse.object('새로운 질문 등록', {
        inquiry: anonymityInquiry ?? inquiry,
      }));
  }

  @SubscribeMessage(LectureEvents.JOIN_LECTURE)
  @UseGuards(SocketAuthGuard)
  async handleJoin(
    @ReqUser() user: User,
    @MessageBody() joinLectureDto: JoinSpecificLectureDto,
    @ConnectedSocket() client: Socket) {
    const { id } = joinLectureDto;
    const lecture = await this.lectureService.findOne(id);

    if (lecture === undefined) {
      throw new DataNotFoundError(ErrorCode.LECTURE_NOT_FOUND);
    }

    const userIsJoined = await this.auditorService.isJoined(user, lecture);
    if (!userIsJoined) {
      throw new PermissionDenied(ErrorCode.NOT_LECTURE_AUDITOR);
    }

    client.join(this.composeRoomName(id));
    this.emitJoin(user, lecture);
  }

  async emitClose(lecture: Lecture) {
    this.server
      .to(this.composeRoomName(lecture.id))
      .emit(LectureEvents.LECTURE_CLOSED, SocketBaseResponse.object('강의 종료됨', {
        lectureId: lecture.id,
      }));
  }

  async emitJoin(user: User, lecture: Lecture) {
    const { id: userId } = user;
    const { id: lectureId } = lecture;

    this.server
      .to(this.composeRoomName(lectureId))
      .emit(LectureEvents.USER_JOINED, SocketBaseResponse.object('타회원의 강의 접속', {
        userId,
      }));
  }
}
