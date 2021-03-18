import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auditor } from 'entities/auditor.entity';
import { AuditorRepository } from './auditor.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auditor]),
  ],
  exports: [AuditorRepository],
})
export class AuditorModule { }
