import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auditor } from 'entities/auditor.entity';
import { Lecture } from 'entities/lecture.entity';
import { User } from 'entities/user.entity';
import { DataConflictError } from 'errors/data-conflict.error';
import { ErrorCode } from 'errors/error-code.enum';
import { Builder } from 'utils/builder/builder.util';
import { AuditorRepository } from './auditor.repository';

@Injectable()
export class AuditorService {

  constructor(
    @InjectRepository(Auditor)
    private readonly auditorRepository: AuditorRepository,
  ) { }

  async joinLecture(joinUser: User, lecture: Lecture) {
    if (lecture.isClosed) {
      throw new DataConflictError(ErrorCode.LECTURE_CLOSED);
    }

    const isAuditor = await this.isJoined(joinUser, lecture);
    if (!isAuditor) {
      const auditor = Builder<Auditor>()
        .lecture(lecture)
        .user(joinUser)
        .build();

      await this.auditorRepository.save(auditor);
    }
  }

  async isJoined(user: User, lecture: Lecture): Promise<boolean> {
    const auditor = await this.auditorRepository.findByLectureAndUser(lecture.id, user.id);
    if (auditor === undefined) {
      return false;
    }

    return true;
  }

  async create(user: User, lecture: Lecture) {
    const auditor = Builder<Auditor>()
      .lecture(lecture)
      .user(user)
      .build();

    this.auditorRepository.save(auditor);
  }
}

