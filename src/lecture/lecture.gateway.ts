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
import { IHasRoomGateway } from 'interface/gateway/has-room-gateway.interface';
import { SocketBaseResponse } from 'models/socket/socket-base.response';
import { Server, Socket } from 'socket.io';
import { JoinLectureDto } from './dto/join-lecture.dto';
import { JoinSpecificLectureDto } from './dto/join-specific-lecture.dto';
import { LectureEvents } from './lecture.event';
import { LectureService } from './lecture.service';

@WebSocketGateway({ namespace: 'lecture' })
export class LectureGateway implements IHasRoomGateway {
  constructor(
    private readonly auditorService: AuditorService,
    private readonly lectureService: LectureService,
  ) { }

  @WebSocketServer()
  readonly server!: Server;

  composeRoomName(id: string): string {
    return `lecture-${id}`;
  }

  @SubscribeMessage(LectureEvents.JOIN_LECTURE)
  @UsePipes(ValidationPipe)
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
