export class BaseResponse {
  constructor(
    public message: string,
    public data?: any
  ) { }

  static object(message: string, data?: any) {
    return new BaseResponse(message, data);
  }
}