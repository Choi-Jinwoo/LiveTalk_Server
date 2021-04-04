import { IsNotEmpty } from 'class-validator';

export class JoinLecturerLectureDto {
  @IsNotEmpty()
  adminCode!: string;
}