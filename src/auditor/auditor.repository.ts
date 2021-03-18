import { Auditor } from 'entities/auditor.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Auditor)
export class AuditorRepository extends Repository<Auditor>{
  findByLectureAndUser(lectureId: string, userId: string) {
    return this.createQueryBuilder()
      .where('fk_lecture_id = :lectureId', { lectureId })
      .andWhere('fk_user_id = :userId', { userId })
      .getOne();
  }
}