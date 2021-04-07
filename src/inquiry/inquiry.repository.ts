import { Inquiry } from 'entities/inquiry.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Page } from 'utils/page/page.util';

@EntityRepository(Inquiry)
export class InquiryRepository extends Repository<Inquiry> {
  findByLectureWithUser(lectureId: string, page: Page) {
    return this.createQueryBuilder('inquiry')
      .leftJoinAndSelect('inquiry.user', 'user')
      .where('fk_lecture_id = :lectureId', { lectureId })
      .offset(page.offset)
      .limit(page.limit)
      .orderBy('created_at', 'ASC')
      .getMany();
  }
}