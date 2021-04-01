import { Injectable } from '@nestjs/common';
import { JWT } from 'config/dotenv';
import { User } from 'entities/user.entity';
import * as jwt from 'jsonwebtoken';
import { StringIterator } from 'lodash';
import { TokenRedis } from './token.redis';

export type TokenDecode = {
  id: string;
}

@Injectable()
export class TokenService {
  constructor(
    private readonly tokenRedis: TokenRedis,
  ) { }

  generate(user: User): string {
    const { id } = user;
    const payload: TokenDecode = {
      id,
    }

    const options: jwt.SignOptions = {
      expiresIn: JWT.EXPIRES_IN,
      issuer: JWT.ISSUER,
      subject: JWT.SUBJECT,
    }

    return jwt.sign(payload, JWT.SECRET, options);
  }

  verify(token: string) {
    const decoded = jwt.verify(token, JWT.SECRET) as TokenDecode;

    return decoded;
  }

  async find(id: string): Promise<string | null> {
    return this.tokenRedis.get(id);
  }

  async save(id: string, token: string) {
    await this.tokenRedis.set(id, token);
  }
}
