import { Inquiry } from 'entities/inquiry.entity';
import { User } from 'entities/user.entity';
import { LectureRo } from 'lecture/ro/lecture.ro';
import { Builder } from 'utils/builder/builder.util';

export class InquiryRo {
  content!: string;
  lecture!: LectureRo;
  createdAt!: Date;
  user!: User | null;

  static fromInquiry(inquiry: Inquiry): InquiryRo {
    const { lecture, content, user, createdAt } = inquiry;

    const lectureRo = LectureRo.fromLecture(lecture);

    return Builder<InquiryRo>()
      .content(content)
      .user(user)
      .lecture(lectureRo)
      .createdAt(createdAt)
      .build();
  }
}