import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auditor } from 'entities/auditor.entity';
import { Lecture } from 'entities/lecture.entity';
import { User } from 'entities/user.entity';
import { AuditorRepository } from './auditor.repository';

@Injectable()
export class AuditorService {

  constructor(
    @InjectRepository(Auditor)
    private readonly auditorRepository: AuditorRepository,
  ) { }

  async isJoined(user: User, lecture: Lecture): Promise<boolean> {
    const auditor = await this.auditorRepository.findByLectureAndUser(lecture.id, user.id);
    if (auditor === undefined) {
      return false;
    }

    return true;
  }

  async create(user: User, lecture: Lecture) {
    const auditor = new Auditor();
    auditor.user = user;
    auditor.lecture = lecture;

    this.auditorRepository.save(auditor);
  }
}

