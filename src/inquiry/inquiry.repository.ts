import { Inquiry } from 'entities/inquiry.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Inquiry)
export class InquiryRepository extends Repository<Inquiry> { }