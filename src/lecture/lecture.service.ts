import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ADMIN_CODE_LENGTH, JOIN_CODE_LENGTH } from 'constants/lecture';
import { Lecture } from 'entities/lecture.entity';
import { DataNotFoundError } from 'errors/data-not-found.error';
import { ErrorCode } from 'errors/error-code.enum';
import { InvalidDataError } from 'errors/invalid-data.error';
import { PermissionDenied } from 'errors/permission-denied.error';
import { JoinColumn } from 'typeorm';
import { UserService } from 'user/user.service';
import { CharRandom, NumberRandom } from 'utils/random/random.util';
import { CloseLectureDto } from './dto/close-lecture.dto';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { LectureRepository } from './lecture.repository';

@Injectable()
export class LectureService {
  constructor(
    @InjectRepository(Lecture)
    private readonly lectureRepository: LectureRepository,
  ) { }

  async findOne(id: string): Promise<Lecture | undefined> {
    return this.lectureRepository.findOne(id);
  }

  async create(createLectureDto: CreateLectureDto): Promise<Lecture> {
    const lecture = this.lectureRepository.create(createLectureDto);

    const createdLecture = await this.lectureRepository.save({
      ...lecture,
      adminCode: new NumberRandom(ADMIN_CODE_LENGTH).rand(),
      JoinColumn: new CharRandom(JOIN_CODE_LENGTH).rand(),
    });

    return createdLecture;
  }

  async close(closeLectureDto: CloseLectureDto): Promise<Lecture> {
    const { lectureId, adminCode } = closeLectureDto;

    const lecture = await this.lectureRepository.findOne(lectureId);
    if (lecture === undefined) {
      throw new DataNotFoundError(ErrorCode.LECTURE_NOT_FOUND);
    }

    if (lecture.isClosed) {
      throw new InvalidDataError(ErrorCode.LECTURE_CLOSED);
    }

    if (lecture.adminCode !== adminCode) {
      throw new PermissionDenied(ErrorCode.NOT_LECTURE_ADMIN);
    }

    lecture.isClosed = true;
    return await this.lectureRepository.save(lecture);
  }

  async findOrFailByJoinCode(joinCode: string): Promise<Lecture> {
    const lecture = await this.lectureRepository.findByJoinCode(joinCode);
    if (lecture === undefined) {
      throw new DataNotFoundError(ErrorCode.LECTURE_NOT_FOUND);
    }

    return lecture;
  }
}
