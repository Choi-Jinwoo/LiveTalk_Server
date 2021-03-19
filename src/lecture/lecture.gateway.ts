import { InjectRepository } from '@nestjs/typeorm';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { User } from 'entities/user.entity';
import { AuthFailedError } from 'errors/auth-failed';
import { DataNotFoundError } from 'errors/data-not-found';
import { ErrorCode } from 'errors/error-code.enum';
import { SocketErrorResponse } from 'models/socket/socket-error.response';
import { RedisClientService } from 'redis-client/redis-client.service';
import { Socket } from 'socket.io';
import { TokenService } from 'token/token.service';
import { UserRepository } from 'user/user.repository';
import { LectureEvents } from './lecture.event';

@WebSocketGateway({ namespace: 'lecture' })
export class LectureGateway implements OnGatewayConnection, OnGatewayDisconnect {
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

      this.redisClientService.setSocket(id, client.id);

      const user = await this.userRepository.findOne(id);
      if (user === undefined) {
        throw new AuthFailedError(ErrorCode.INVALID_TOKEN);
      }
    } catch (err) {

      switch (err.constructor) {
        case AuthFailedError:
          client.emit(LectureEvents.CONNECT_ERROR,
            SocketErrorResponse.fromErrorCode(ErrorCode.INVALID_TOKEN));
          break;

        default:
          client.emit(LectureEvents.CONNECT_ERROR,
            SocketErrorResponse.fromErrorCode(ErrorCode.SERVER_ERROR));
      }

      client.disconnect();
    }
  }

  handleDisconnect(client: any) {
    console.log('pass');
  }
}
