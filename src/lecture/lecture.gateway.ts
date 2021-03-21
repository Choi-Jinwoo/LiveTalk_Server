import { InjectRepository } from '@nestjs/typeorm';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Lecture } from 'entities/lecture.entity';
import { User } from 'entities/user.entity';
import { AuthFailedError } from 'errors/auth-failed';
import { DataNotFoundError } from 'errors/data-not-found';
import { DuplicateError } from 'errors/duplicate.error';
import { ErrorCode } from 'errors/error-code.enum';
import { join } from 'lodash';
import { SocketErrorResponse } from 'models/socket/socket-error.response';
import { RedisClientService } from 'redis-client/redis-client.service';
import { Server } from 'socket.io';
import { Socket } from 'socket.io';
import { TokenService } from 'token/token.service';
import { UserRepository } from 'user/user.repository';
import { LectureEvents } from './lecture.event';

@WebSocketGateway({ namespace: 'lecture' })
export class LectureGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  readonly server!: Server;

  private clients: Socket[] = [];

  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
    private readonly redisClientService: RedisClientService,
  ) { }

  private composeRoomName(id: string): string {
    return `lecture-${id}`;
  }

  async handleConnection(client: Socket) {
    const token = client.handshake.query['x-access-token'] as string;

    try {
      const { id } = this.tokenService.verifyToken(token);

      const socketId = await this.redisClientService.getSocket(id);
      if (socketId !== null) {
        throw new DuplicateError(ErrorCode.DUPLICATE_SOCKET_CONNECT);
      }

      const user = await this.userRepository.findOne(id);
      if (user === undefined) {
        throw new AuthFailedError(ErrorCode.INVALID_TOKEN);
      }

      this.redisClientService.setSocket(id, client.id, this.clients.length);
      this.clients.push(client);
    } catch (err) {
      console.log(err);

      switch (err.constructor) {
        case AuthFailedError:
          client.emit(LectureEvents.CONNECT_ERROR,
            SocketErrorResponse.fromErrorCode(err.errorCode));
          break;

        case DuplicateError:
          client.emit(LectureEvents.CONNECT_ERROR,
            SocketErrorResponse.fromErrorCode(err.errorCode));
          break;

        default:
          client.emit(LectureEvents.CONNECT_ERROR,
            SocketErrorResponse.fromErrorCode(ErrorCode.SERVER_ERROR));
      }

      client.disconnect();
    }
  }

  async join(user: User, lecture: Lecture) {
    const { id: userId } = user;
    const { id: lectureId } = lecture;

    const socketData = await this.redisClientService.getSocket(userId);
    const { clientIndex } = socketData;

    this.clients[clientIndex].join(this.composeRoomName(lectureId));
    this.server.to(this.composeRoomName(lectureId)).emit('event', 'hi');
  }

  async handleDisconnect(client: Socket) {
    const token = client.handshake.query['x-access-token'] as string;

    try {
      const { id } = this.tokenService.verifyToken(token);

      this.redisClientService.removeSocket(id);
    } catch (err) { }
  }
}
