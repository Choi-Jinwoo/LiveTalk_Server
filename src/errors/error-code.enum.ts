export class ErrorCode {
  static SERVER_ERROR = new ErrorCode('C001', '서버 오류');

  static MEMBER_NOT_REGISTERED = new ErrorCode('M001', '회원이 등록되지 않음');
  static DUPLICATE_ID = new ErrorCode('M002', '중복된 아이디');

  static DODAM_TOKEN_EXPIRED = new ErrorCode('T001', '도담도담 토큰 만료');

  constructor(
    readonly code: string,
    readonly message: string,
  ) { }

}