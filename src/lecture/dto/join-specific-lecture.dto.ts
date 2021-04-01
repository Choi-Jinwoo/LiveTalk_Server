import { IsUUID } from 'class-validator';

export class JoinSpecificLectureDto {
  @IsUUID()
  id!: string;
}