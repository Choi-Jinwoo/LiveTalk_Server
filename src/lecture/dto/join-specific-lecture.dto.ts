import { IsUUID } from 'class-validator';

export class JoinSpecificLectureDto {
  @IsUUID('all')
  id!: string;
}