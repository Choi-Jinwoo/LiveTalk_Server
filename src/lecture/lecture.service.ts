import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ADMIN_CODE_LENGTH, JOIN_CODE_LENGTH } from 'constants/lecture';
import { Lecture } from 'entities/lecture.entity';
import { create } from 'lodash';
import { CharRandom, NumberRandom } from 'util/random';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { LectureRepository } from './lecture.repository';

@Injectable()
export class LectureService {
  constructor(
    @InjectRepository(Lecture)
    private readonly lectureRepository: LectureRepository,
  ) { }

  async create(createLectureDto: CreateLectureDto): Promise<Lecture> {
    const lecture = this.lectureRepository.create(createLectureDto);

    lecture.adminCode = new NumberRandom(ADMIN_CODE_LENGTH).rand();
    lecture.joinCode = new CharRandom(JOIN_CODE_LENGTH).rand();

    const createdLecture = await this.lectureRepository.save(lecture);

    return createdLecture;
  }
}
