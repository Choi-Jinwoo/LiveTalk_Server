import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { BaseWsExceptionFilter } from '@nestjs/websockets';

@Catch()
export class SocketErrorFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // TODO: 로그 추가
    console.log(exception);
  }
}