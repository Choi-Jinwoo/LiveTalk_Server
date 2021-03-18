import { Auditor } from 'entities/auditor.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Auditor)
export class AuditorRepository extends Repository<Auditor>{
}