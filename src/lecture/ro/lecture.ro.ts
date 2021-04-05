import { Lecture } from 'entities/lecture.entity';
import { Builder } from 'utils/builder/builder.util';

export class LectureRo {
  id!: string;
  title!: string;
  isClosed!: boolean;
  startAt!: Date;
  endAt!: Date;
  createdAt!: Date;

  static fromLecture(lecture: Lecture): LectureRo {
    const { id, title, isClosed, startAt, endAt, createdAt } = lecture;
    return Builder<LectureRo>()
      .id(id)
      .title(title)
      .isClosed(isClosed)
      .startAt(startAt)
      .endAt(endAt)
      .createdAt(createdAt)
      .build();
  }
}