import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { AuditorService } from 'auditor/auditor.service';
import { ReqUser } from 'decorators/req-user.decorator';
import { Lecture } from 'entities/lecture.entity';
import { User } from 'entities/user.entity';
import { ErrorCode } from 'errors/error-code.enum';
import { PermissionDenied } from 'errors/permission-denied.error';
import { SocketAuthGuard } from 'guards/auth/socket-auth.guard';
import { CreateInquiryDto } from 'inquiry/dto/create-inquiry.dto';
import { InquiryService } from 'inquiry/inquiry.service';
import { IHasRoomGateway } from 'interface/gateway/has-room-gateway.interface';
import { SocketBaseResponse } from 'models/socket/socket-base.response';
import { Server, Socket } from 'socket.io';
import { JoinSpecificLectureDto } from '../lecture/dto/join-specific-lecture.dto';
import { InquiryEvents } from './inquiry.event';
import { LectureService } from 'lecture/lecture.service';
import { LecturerJoinDto } from 'lecture/dto/lecturer-join.dto';
import { InquiryRo } from './ro/inquiry.ro';

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

  @SubscribeMessage(InquiryEvents.SEND_INQUIRY)
  @UseGuards(SocketAuthGuard)
  async handleSendInquiry(
    @ReqUser() reqUser: User,
    @MessageBody() createInquiryDto: CreateInquiryDto) {

    const inquiry = await this.inquiryService.create(reqUser, createInquiryDto);
    const inquiryRo = InquiryRo.fromInquiry(inquiry);

    if (inquiry.isAnonymity) {
      inquiryRo.user = null;
    }

    this.server
      .to(this.composeRoomName(inquiryRo.lecture.id))
      .emit(InquiryEvents.NEW_INQUIRY, SocketBaseResponse.object(200, '새로운 질문 등록', {
        inquiry: inquiryRo,
      }));
  }

  @SubscribeMessage(InquiryEvents.LECTURER_JOIN)
  async handleLecturerJoin(
    @MessageBody() joinLectureDto: LecturerJoinDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { adminCode } = joinLectureDto;
      const lecture = await this.lectureService.findOrFailByAdminCode(adminCode);

      client.join(this.composeRoomName(lecture.id));
      client.emit(
        InquiryEvents.LECTURER_JOIN,
        SocketBaseResponse.object(200, '강의 접속 성공'));
    } catch (err) {
      client.emit(
        InquiryEvents.LECTURER_JOIN,
        SocketBaseResponse.object(404, '관리자 번호에 맞는 강의 없음'));
    }
  }

  @SubscribeMessage(InquiryEvents.JOIN_LECTURE)
  @UseGuards(SocketAuthGuard)
  async handleJoin(
    @ReqUser() user: User,
    @MessageBody() joinLectureDto: JoinSpecificLectureDto,
    @ConnectedSocket() client: Socket) {
    const { id } = joinLectureDto;
    const lecture = await this.lectureService.findOneOrFail(id);

    const userIsJoined = await this.auditorService.isJoined(user, lecture);
    if (!userIsJoined) {
      throw new PermissionDenied(ErrorCode.NOT_LECTURE_AUDITOR);
    }

    client.join(this.composeRoomName(id));
    this.emitJoinToRoom(user, lecture);
  }

  async emitClose(lecture: Lecture) {
    this.server
      .to(this.composeRoomName(lecture.id))
      .emit(InquiryEvents.LECTURE_CLOSED, SocketBaseResponse.object(200, '강의 종료됨', {
        lectureId: lecture.id,
      }));
  }

  async emitJoinToRoom(user: User, lecture: Lecture) {
    const { id: userId } = user;
    const { id: lectureId } = lecture;

    this.server
      .to(this.composeRoomName(lectureId))
      .emit(InquiryEvents.USER_JOINED, SocketBaseResponse.object(200, '타회원의 강의 접속', {
        userId,
      }));
  }
}
