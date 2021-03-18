import { IsDateString, IsNotEmpty, Length } from 'class-validator';

export class CreateLectureDto {
  @IsNotEmpty()
  @Length(0, 100)
  title!: string;

  @IsDateString()
  startAt!: string;

  @IsDateString()
  endAt!: string;
}