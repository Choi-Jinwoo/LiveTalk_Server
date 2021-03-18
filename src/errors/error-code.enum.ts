export class ErrorCode {
  static SERVER_ERROR = new ErrorCode('C001', '서버 오류');

  static USER_NOT_FOUND = new ErrorCode('U001', '회원이 없음');

  static DODAM_TOKEN_EXPIRED = new ErrorCode('T001', '도담도담 토큰 만료');

  constructor(
    readonly code: string,
    readonly message: string,
  ) { }

}