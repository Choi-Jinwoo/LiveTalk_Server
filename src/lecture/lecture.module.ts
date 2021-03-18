import { Module } from '@nestjs/common';
import { LectureService } from './lecture.service';
import { LectureController } from './lecture.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lecture } from 'entities/lecture.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lecture]),
  ],
  providers: [LectureService],
  controllers: [LectureController],
})
export class LectureModule { }
