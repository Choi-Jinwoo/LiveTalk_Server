import { Lecture } from 'entities/lecture.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Lecture)
export class LectureRepository extends Repository<Lecture> {
  findByAdminCode(adminCode: string): Promise<Lecture | undefined> {
    return this.createQueryBuilder()
      .where('admin_code = :adminCode', { adminCode })
      .getOne();
  }

  findByJoinCode(joinCode: string): Promise<Lecture | undefined> {
    return this.createQueryBuilder()
      .where('join_code = :joinCode', { joinCode })
      .getOne();
  }
}