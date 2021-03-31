import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Lecture } from 'entities/lecture.entity';
import { User } from 'entities/user.entity';
import { IHasRoomGateway } from 'interface/gateway/has-room-gateway.interface';
import { SocketBaseResponse } from 'models/socket/socket-base.response';
import { Server, Socket } from 'socket.io';
import { LectureEvents } from './lecture.event';

@WebSocketGateway({ namespace: 'lecture' })
export class LectureGateway implements IHasRoomGateway {
  @WebSocketServer()
  readonly server!: Server;

  composeRoomName(id: string): string {
    return `lecture-${id}`;
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
