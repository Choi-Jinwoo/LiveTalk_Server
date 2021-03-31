import { createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const ReqUser = createParamDecorator((_, req: Request) => req.user);