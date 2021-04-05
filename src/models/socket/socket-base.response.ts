export class SocketBaseResponse {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) { }

  static object(status: number, message: string, data?: any) {
    return new SocketBaseResponse(status, message, data);
  }
}