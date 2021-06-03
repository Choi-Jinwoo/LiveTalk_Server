import { Lecture } from 'entities/lecture.entity';
import { Builder } from 'utils/builder/builder.util';

export class LectureRo {
  id!: string;
  title!: string;
  isClosed!: boolean;
  createdAt!: Date;
  lecturer!: string;

  static fromLecture(lecture: Lecture): LectureRo {
    const { id, title, isClosed, lecturer, createdAt } = lecture;
    return Builder<LectureRo>()
      .id(id)
      .title(title)
      .isClosed(isClosed)
      .createdAt(createdAt)
      .lecturer(lecturer)
      .build();
  }
}