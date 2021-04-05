import { ExecutionContext } from '@nestjs/common';
import { HttpArgumentsHost, WsArgumentsHost } from '@nestjs/common/interfaces';

export interface UseContext {
  switchContext(context: ExecutionContext): HttpArgumentsHost | WsArgumentsHost;
}