import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { DODAM_URL } from 'config/endpoint';

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
        console.log(err);
      });
  }

  async login(id: string, pw: string) {
  }
}