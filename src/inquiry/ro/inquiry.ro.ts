import { Inquiry } from 'entities/inquiry.entity';
import { User } from 'entities/user.entity';
import { InquiryModule } from 'inquiry/inquiry.module';
import { LectureRo } from 'lecture/ro/lecture.ro';
import { Builder } from 'utils/builder/builder.util';

export class InquiryRo {
  content!: string;
  lecture!: LectureRo;
  user!: User | null;

  static fromInquiry(inquiry: Inquiry): InquiryRo {
    const { lecture, content, user } = inquiry;

    const lectureRo = LectureRo.fromLecture(lecture);

    return Builder<InquiryRo>()
      .content(content)
      .user(user)
      .lecture(lectureRo)
      .build();
  }
}