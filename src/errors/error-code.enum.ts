export class ErrorCode {
  static SERVER_ERROR = new ErrorCode('C001', '서버 오류');
  static INVALID_INPUT = new ErrorCode('C002', '옳지 않은 입력 값');

  static DUPLICATE_SOCKET_CONNECT = new ErrorCode('S001', '중복된 회원의 접속');
  static DISCONNECTED_SOCKET = new ErrorCode('S002', '연결이 종료된 소켓');

  static INVALID_TOKEN = new ErrorCode('T001', '옳지 않은 토큰');
  static TOKEN_EXPIRED = new ErrorCode('T002', '토큰 만료');

  static USER_NOT_FOUND = new ErrorCode('U001', '회원이 없음');

  static LECTURE_NOT_FOUND = new ErrorCode('L001', '강의 없음');
  static LECTURE_CLOSED = new ErrorCode('L002', '이미 종료된 강의');
  static ALREADY_JOINED = new ErrorCode('L003', '이미 참여한 강의');
  static NOT_LECTURE_ADMIN = new ErrorCode('L004', '강의 관리자가 아님');

  static DODAM_TOKEN_EXPIRED = new ErrorCode('D001', '도담도담 토큰 만료');

  constructor(
    readonly code: string,
    readonly message: string,
  ) { }

}