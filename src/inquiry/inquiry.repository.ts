import { Inquiry } from 'entities/inquiry.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Page } from 'utils/page/page.util';

@EntityRepository(Inquiry)
export class InquiryRepository extends Repository<Inquiry> {
  findByLecture(lectureId: string, page: Page) {
    return this.createQueryBuilder()
      .where('fk_lecture_id = :lectureId', { lectureId })
      .offset(page.offset)
      .limit(page.limit)
      .orderBy('created_at', 'DESC')
      .getMany();
  }
}