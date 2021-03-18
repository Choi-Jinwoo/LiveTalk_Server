import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('lecture')
export class Lecture {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id!: string;

  @Column({
    name: 'title',
  })
  title!: string;

  @Column({
    name: 'join_code',
    unique: true,
  })
  joinCode!: string;

  @Column({
    name: 'is_closed',
  })
  isClosed: boolean = false;

  @Column({
    name: 'admin_code',
    unique: true,
  })
  adminCode!: string;

  @Column({
    name: 'start_at',
  })
  startAt!: Date;

  @Column({
    name: 'end_at',
  })
  endAt!: Date;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt!: Date;
}