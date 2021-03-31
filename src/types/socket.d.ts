import { User } from 'entities/user.entity';
import { TokenDecode } from 'token/token.service';

declare module 'socket.io' {
  export interface Socket {
    user: User,
  }
}