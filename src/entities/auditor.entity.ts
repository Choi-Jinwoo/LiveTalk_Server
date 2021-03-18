import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { Lecture } from './lecture.entity';
import { User } from './user.entity';

@Entity('auditor')
export class Auditor {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id!: string;

  @JoinColumn({ name: 'fk_user_id' })
  @ManyToOne(type => User, {
    onDelete: 'SET NULL',
  })
  user!: User;

  @RelationId((auditor: Auditor) => auditor.user)
  userId!: string;

  @JoinColumn({ name: 'fk_lecture_id' })
  @ManyToOne(type => Lecture, {
    onDelete: 'CASCADE',
  })
  lecture!: Lecture;

  @RelationId((auditor: Auditor) => auditor.lecture)
  lectureId!: string;
}