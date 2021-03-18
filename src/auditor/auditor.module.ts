import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditorRepository } from './auditor.repository';
import { AuditorService } from './auditor.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuditorRepository]),
  ],
  providers: [AuditorService],
  exports: [AuditorService],
})
export class AuditorModule { }
