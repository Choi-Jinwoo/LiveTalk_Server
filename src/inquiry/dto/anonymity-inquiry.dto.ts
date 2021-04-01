import { Lecture } from 'entities/lecture.entity';

export class AnonymityInquiryDto {
  id!: string;
  content!: string;
  lectureId!: string;
  lecture!: Lecture;
  createdAt!: Date;
  readonly isAnonymity: boolean = true;
}