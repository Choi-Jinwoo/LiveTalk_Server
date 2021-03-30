import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, RelationId } from 'typeorm';
import { Lecture } from './lecture.entity';
import { User } from './user.entity';

@Entity('inquiry')
export class Inquiry {
  @PrimaryColumn('uuid', {
    name: 'id',
  })
  id!: string;

  @RelationId((inquiry: Inquiry) => inquiry.lecture)
  lectureId!: string;

  @JoinColumn({ name: 'fk_lecture_id' })
  @ManyToOne(type => Lecture, {
    onDelete: 'CASCADE',
  })
  lecture!: Lecture;

  @RelationId((inquiry: Inquiry) => inquiry.user)
  userId!: string;

  @JoinColumn({ name: 'fk_user_id' })
  @ManyToOne(type => User, {
    onDelete: 'SET NULL',
  })
  user!: User;

  @Column('text', {
    name: 'content',
  })
  content!: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt!: Date;
}