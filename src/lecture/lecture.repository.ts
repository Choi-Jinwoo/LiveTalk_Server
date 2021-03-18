import { Lecture } from 'entities/lecture.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Lecture)
export class LectureRepository extends Repository<Lecture> {
}