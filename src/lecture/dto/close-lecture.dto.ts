import { IsNotEmpty, IsUUID } from 'class-validator';

export class CloseLectureDto {
  @IsUUID()
  lectureId!: string;

  @IsNotEmpty()
  adminCode!: string;
}