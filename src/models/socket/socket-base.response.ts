export class SocketBaseResponse {
  constructor(
    public message: string,
    public data?: any
  ) { }

  static object(message: string, data?: any) {
    return new SocketBaseResponse(message, data);
  }
}