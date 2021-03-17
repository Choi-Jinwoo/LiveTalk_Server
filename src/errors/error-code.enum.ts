export class ErrorCode {
  static DODAM_TOKEN_EXPIRED = new ErrorCode('T001', '도담도담 토큰 만료');

  static MEMBER_NOT_REGISTERED = new ErrorCode('M001', '회원이 등록되지 않음');

  constructor(
    readonly code: string,
    readonly message: string,
  ) { }

}