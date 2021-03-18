import { IsNotEmpty } from 'class-validator';

export class JoinLectureDto {
  @IsNotEmpty()
  joinCode!: string;
}