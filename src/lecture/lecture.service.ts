import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditorRepository } from 'auditor/auditor.repository';
import { ADMIN_CODE_LENGTH, JOIN_CODE_LENGTH } from 'constants/lecture';
import { Auditor } from 'entities/auditor.entity';
import { Lecture } from 'entities/lecture.entity';
import { User } from 'entities/user.entity';
import { DataConflictError } from 'errors/data-conflict';
import { DataNotFoundError } from 'errors/data-not-found';
import { ErrorCode } from 'errors/error-code.enum';
import { ExpiredError } from 'errors/expired.error';
import { PermissionDenied } from 'errors/permission-denied';
import { LectureGateway } from 'lecture/lecture.gateway';
import { CharRandom, NumberRandom } from 'util/random';
import { CloseLectureDto } from './dto/close-lecture.dto';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { JoinLectureDto } from './dto/join-lecture.dto';
import { LectureRepository } from './lecture.repository';

@Injectable()
export class LectureService {
  constructor(
    @InjectRepository(Lecture)
    private readonly lectureRepository: LectureRepository,

    @InjectRepository(Auditor)
    private readonly auditorRepository: AuditorRepository,

    private readonly lectureGateway: LectureGateway,
  ) { }

  async create(createLectureDto: CreateLectureDto): Promise<Lecture> {
    const lecture = this.lectureRepository.create(createLectureDto);

    lecture.adminCode = new NumberRandom(ADMIN_CODE_LENGTH).rand();
    lecture.joinCode = new CharRandom(JOIN_CODE_LENGTH).rand();

    const createdLecture = await this.lectureRepository.save(lecture);

    return createdLecture;
  }

  async close(closeLectureDto: CloseLectureDto) {
    const { lectureId, adminCode } = closeLectureDto;

    const lecture = await this.lectureRepository.findOne(lectureId);
    if (lecture === undefined) {
      throw new DataNotFoundError(ErrorCode.LECTURE_NOT_FOUND);
    }

    if (lecture.isClosed) {
      throw new BadRequestException(ErrorCode.LECTURE_CLOSED);
    }

    if (lecture.adminCode !== adminCode) {
      throw new PermissionDenied(ErrorCode.NOT_LECTURE_ADMIN);
    }

    lecture.isClosed = true;
    await this.lectureRepository.save(lecture);

    this.lectureGateway.close(lecture);
  }

  async join(joinUser: User, joinLectureDto: JoinLectureDto) {
    const { joinCode } = joinLectureDto;
    const lecture = await this.lectureRepository.findByJoinCode(joinCode);
    if (lecture === undefined) {
      throw new DataNotFoundError(ErrorCode.LECTURE_NOT_FOUND);
    }

    if (lecture.isClosed) {
      throw new BadRequestException(ErrorCode.LECTURE_CLOSED);
    }

    const duplicateAuditor = await this.auditorRepository.findByLectureAndUser(lecture.id, joinUser.id);
    if (duplicateAuditor === undefined) {
      const auditor = new Auditor();
      auditor.lecture = lecture;
      auditor.user = joinUser;

      await this.auditorRepository.save(auditor);
    }

    await this.lectureGateway.join(joinUser, lecture);
  }
}
