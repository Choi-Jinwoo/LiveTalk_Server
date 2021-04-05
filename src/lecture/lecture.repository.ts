import { Lecture } from 'entities/lecture.entity';
import { EntityRepository, Repository } from 'typeorm';

const attributes = [
  'id',
  'title',
  'joinCode',
  'isClosed',
  'adminCode',
  'startAt',
  'endAt',
  'createdAt',
]

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

  findSelectAll(id: string): Promise<Lecture | undefined> {
    return this.createQueryBuilder()
      .select(attributes)
      .where('id = :id', { id })
      .getOne();
  }
}