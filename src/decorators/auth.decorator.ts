import { createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const Auth = createParamDecorator((_, req: Request) => req.decoded);