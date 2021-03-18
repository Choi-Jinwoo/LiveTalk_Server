import { Injectable } from '@nestjs/common';
import { AuditorRepository } from './auditor.repository';

@Injectable()
export class AuditorService {
  constructor(
    private readonly auditorRepository: AuditorRepository,
  ) { }
}
