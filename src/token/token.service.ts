import { Injectable } from '@nestjs/common';
import { JWT } from 'config/dotenv';
import { User } from 'entities/user.entity';
import * as jwt from 'jsonwebtoken';

export type TokenPayloadType = {
  id: string;
}

@Injectable()
export class TokenService {
  createToken(user: User): string {
    const { id } = user;
    const payload: TokenPayloadType = {
      id,
    }

    const options: jwt.SignOptions = {
      expiresIn: JWT.EXPIRES_IN,
      issuer: JWT.ISSUER,
      subject: JWT.SUBJECT,
    }

    return jwt.sign(payload, JWT.SECRET, options);
  }

  verifyToken(token: string) {
    const decoded = jwt.verify(token, JWT.SECRET) as TokenPayloadType;

    return decoded;
  }
}
