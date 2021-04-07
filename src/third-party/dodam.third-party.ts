import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance, AxiosError } from 'axios';
import { DODAM } from 'config/dotenv';
import { DODAM_URL } from 'config/endpoint';
import { AuthFailedError } from 'errors/auth-failed.error';
import { ErrorCode } from 'errors/error-code.enum';
import { ExpiredError } from 'errors/expired.error';
import { UnexpectedError } from 'errors/unexpected.error';

@Injectable()
export class DodamThirdParty {
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: DODAM_URL,
    });

    this.applyInterceptors();
  }

  private applyInterceptors() {
    this.axiosInstance.interceptors.response.use(
      (res) => {
        return res;
      },
      (err) => {
        const { status } = err;
        if (status === 410) {
          throw new ExpiredError(ErrorCode.DODAM_TOKEN_EXPIRED);
        }

        throw err;
      });
  }

  async login(id: string, pw: string): Promise<string> {
    try {
      const res = await this.axiosInstance.post(`${DODAM_URL}/auth/login`, {
        id,
        pw,
      }, {
        params: {
          key: DODAM.API_KEY,
        },
      });

      const { data: { data } } = res;
      const token = data['token'];

      return token;
    } catch (err) {
      if (err.response) {
        const { status } = err.response;
        switch (status) {
          case 401:
            throw new AuthFailedError(ErrorCode.LOGIN_FAILED);

          default:
            throw new UnexpectedError(ErrorCode.SERVER_ERROR);
        }
      }

      throw new UnexpectedError(ErrorCode.SERVER_ERROR);
    }
  }

  async getProfile(token: string) {
    try {
      const res = await this.axiosInstance.get(`${DODAM_URL}/members/my`, {
        headers: {
          'x-access-token': token,
        },
      });

      return res.data['data']['memberData'];
    } catch (err) {
      throw new UnexpectedError(ErrorCode.SERVER_ERROR);
    }
  }
}