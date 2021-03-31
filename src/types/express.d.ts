import { TokenPayloadType } from 'token/token.service';

declare module 'express' {
  export interface Request {
    decoded: TokenPayloadType,
  }
}