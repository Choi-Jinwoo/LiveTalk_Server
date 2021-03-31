import { TokenPayloadType } from 'token/token.service';

declare module 'socket.io' {
  export interface Socket {
    decoded: TokenPayloadType,
  }
}