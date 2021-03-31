import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CTX_HTTP_TYPE, CTX_WS_TYPE } from 'constants/request';
import { Request } from 'express';
import { Socket } from 'socket.io';

export const ReqUser = createParamDecorator((_, ctx: ExecutionContext) => {
  const type = ctx.getType();

  switch (type) {
    case CTX_HTTP_TYPE:
      const req = ctx.switchToHttp().getRequest<Request>();

      return req.user;

    case CTX_WS_TYPE:
      const client = ctx.switchToWs().getClient<Socket>();

      return client.user;

    // no default
  }
});